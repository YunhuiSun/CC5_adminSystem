package com.admin.controller;

import com.admin.dto.RoleDTO;
import com.admin.service.RoleService;
import com.admin.common.PageQuery;
import com.admin.common.PageResult;
import com.admin.common.Result;
import com.admin.vo.RoleVO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping("/list")
    public Result<PageResult<RoleVO>> list(PageQuery query) {
        return Result.success(roleService.getRoleList(query));
    }

    @GetMapping("/all")
    public Result<List<RoleVO>> all() {
        return Result.success(roleService.getAllRoles());
    }

    @PostMapping
    public Result<Void> add(@Valid @RequestBody RoleDTO roleDTO) {
        roleService.addRole(roleDTO);
        return Result.success();
    }

    @PutMapping
    public Result<Void> update(@Valid @RequestBody RoleDTO roleDTO) {
        roleService.updateRole(roleDTO);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        roleService.deleteRole(id);
        return Result.success();
    }
}