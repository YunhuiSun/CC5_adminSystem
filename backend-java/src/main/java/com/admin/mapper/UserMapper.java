package com.admin.mapper;

import com.admin.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper extends BaseMapper<User> {

    @Select("SELECT u.*, r.name as role_name FROM sys_user u LEFT JOIN sys_role r ON u.role_id = r.id WHERE u.username = #{username}")
    User selectByUsername(String username);
}