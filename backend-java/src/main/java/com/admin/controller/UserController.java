package com.admin.controller;

import com.admin.dto.UserDTO;
import com.admin.dto.PasswordChangeDTO;
import com.admin.service.UserService;
import com.admin.common.PageQuery;
import com.admin.common.PageResult;
import com.admin.common.Result;
import com.admin.vo.UserVO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public Result<PageResult<UserVO>> list(PageQuery query) {
        return Result.success(userService.getUserList(query));
    }

    @PostMapping
    public Result<Void> add(@Valid @RequestBody UserDTO userDTO) {
        userService.addUser(userDTO);
        return Result.success();
    }

    @PutMapping
    public Result<Void> update(@Valid @RequestBody UserDTO userDTO) {
        userService.updateUser(userDTO);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success();
    }

    @PutMapping("/password")
    public Result<Void> changePassword(@Valid @RequestBody PasswordChangeDTO passwordChangeDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        userService.changePassword(username, passwordChangeDTO);
        return Result.success();
    }
}