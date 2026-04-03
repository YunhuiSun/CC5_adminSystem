package com.admin.service;

import com.admin.dto.LoginDTO;
import com.admin.dto.UserDTO;
import com.admin.vo.LoginVO;
import com.admin.vo.UserVO;
import com.admin.common.PageQuery;
import com.admin.common.PageResult;

public interface UserService {
    LoginVO login(LoginDTO loginDTO);
    UserVO getCurrentUser(String username);
    PageResult<UserVO> getUserList(PageQuery query);
    void addUser(UserDTO userDTO);
    void updateUser(UserDTO userDTO);
    void deleteUser(Long id);
}