package com.admin.service.impl;

import com.admin.dto.RoleDTO;
import com.admin.entity.Role;
import com.admin.mapper.RoleMapper;
import com.admin.service.RoleService;
import com.admin.vo.RoleVO;
import com.admin.common.PageQuery;
import com.admin.common.PageResult;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleMapper roleMapper;

    @Override
    public PageResult<RoleVO> getRoleList(PageQuery query) {
        Page<Role> page = new Page<>(query.getPageNum(), query.getPageSize());
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(query.getKeyword())) {
            wrapper.like(Role::getName, query.getKeyword());
        }
        wrapper.orderByDesc(Role::getCreateTime);

        Page<Role> rolePage = roleMapper.selectPage(page, wrapper);
        List<RoleVO> list = rolePage.getRecords().stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());

        return PageResult.of(list, rolePage.getTotal(), query.getPageNum(), query.getPageSize());
    }

    @Override
    public List<RoleVO> getAllRoles() {
        List<Role> roles = roleMapper.selectList(null);
        return roles.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    public void addRole(RoleDTO roleDTO) {
        Role role = new Role();
        BeanUtils.copyProperties(roleDTO, role);
        roleMapper.insert(role);
    }

    @Override
    public void updateRole(RoleDTO roleDTO) {
        Role role = new Role();
        BeanUtils.copyProperties(roleDTO, role);
        roleMapper.updateById(role);
    }

    @Override
    public void deleteRole(Long id) {
        roleMapper.deleteById(id);
    }

    private RoleVO convertToVO(Role role) {
        RoleVO vo = new RoleVO();
        BeanUtils.copyProperties(role, vo);
        return vo;
    }
}