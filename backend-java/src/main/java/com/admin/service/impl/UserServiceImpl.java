package com.admin.service.impl;

import com.admin.dto.LoginDTO;
import com.admin.dto.UserDTO;
import com.admin.entity.User;
import com.admin.entity.Role;
import com.admin.mapper.UserMapper;
import com.admin.mapper.RoleMapper;
import com.admin.service.UserService;
import com.admin.config.JwtConfig;
import com.admin.vo.LoginVO;
import com.admin.vo.UserVO;
import com.admin.common.PageQuery;
import com.admin.common.PageResult;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RoleMapper roleMapper;

    @Autowired
    private JwtConfig jwtConfig;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public LoginVO login(LoginDTO loginDTO) {
        System.out.println("DEBUG: 尝试登录用户: " + loginDTO.getUsername());
        User user = userMapper.selectByUsername(loginDTO.getUsername());
        if (user == null) {
            System.out.println("DEBUG: 用户不存在");
            throw new RuntimeException("用户名或密码错误");
        }
        System.out.println("DEBUG: 找到用户: " + user.getUsername());
        System.out.println("DEBUG: 数据库密码: " + user.getPassword());
        System.out.println("DEBUG: 输入密码: " + loginDTO.getPassword());
        boolean matches = passwordEncoder.matches(loginDTO.getPassword(), user.getPassword());
        System.out.println("DEBUG: 密码匹配结果: " + matches);
        if (!matches) {
            throw new RuntimeException("用户名或密码错误");
        }
        if (user.getStatus() == 0) {
            throw new RuntimeException("账号已被禁用");
        }

        String token = jwtConfig.generateToken(user.getUsername());
        LoginVO loginVO = new LoginVO();
        loginVO.setToken(token);
        loginVO.setUser(convertToVO(user));
        return loginVO;
    }

    @Override
    public UserVO getCurrentUser(String username) {
        User user = userMapper.selectByUsername(username);
        return convertToVO(user);
    }

    @Override
    public PageResult<UserVO> getUserList(PageQuery query) {
        Page<User> page = new Page<>(query.getPageNum(), query.getPageSize());
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(query.getKeyword())) {
            wrapper.like(User::getUsername, query.getKeyword())
                    .or()
                    .like(User::getNickname, query.getKeyword());
        }
        wrapper.orderByDesc(User::getCreateTime);

        Page<User> userPage = userMapper.selectPage(page, wrapper);
        List<UserVO> list = userPage.getRecords().stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());

        return PageResult.of(list, userPage.getTotal(), query.getPageNum(), query.getPageSize());
    }

    @Override
    public void addUser(UserDTO userDTO) {
        User user = new User();
        BeanUtils.copyProperties(userDTO, user);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        userMapper.insert(user);
    }

    @Override
    public void updateUser(UserDTO userDTO) {
        User user = new User();
        BeanUtils.copyProperties(userDTO, user);
        if (StringUtils.hasText(userDTO.getPassword())) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        userMapper.updateById(user);
    }

    @Override
    public void deleteUser(Long id) {
        userMapper.deleteById(id);
    }

    private UserVO convertToVO(User user) {
        UserVO vo = new UserVO();
        BeanUtils.copyProperties(user, vo);
        if (user.getRoleId() != null) {
            Role role = roleMapper.selectById(user.getRoleId());
            if (role != null) {
                vo.setRoleName(role.getName());
            }
        }
        return vo;
    }
}