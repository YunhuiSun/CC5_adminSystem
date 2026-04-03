package com.admin.service;

import com.admin.dto.RoleDTO;
import com.admin.vo.RoleVO;
import com.admin.common.PageQuery;
import com.admin.common.PageResult;

import java.util.List;

public interface RoleService {
    PageResult<RoleVO> getRoleList(PageQuery query);
    List<RoleVO> getAllRoles();
    void addRole(RoleDTO roleDTO);
    void updateRole(RoleDTO roleDTO);
    void deleteRole(Long id);
}