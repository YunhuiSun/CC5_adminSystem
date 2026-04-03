package com.admin.service.impl;

import com.admin.entity.LoginLog;
import com.admin.mapper.LoginLogMapper;
import com.admin.service.LoginLogService;
import com.admin.common.PageQuery;
import com.admin.common.PageResult;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class LoginLogServiceImpl implements LoginLogService {

    @Autowired
    private LoginLogMapper loginLogMapper;

    @Override
    public PageResult<LoginLog> getLoginLogList(PageQuery query) {
        Page<LoginLog> page = new Page<>(query.getPageNum(), query.getPageSize());
        LambdaQueryWrapper<LoginLog> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(query.getKeyword())) {
            wrapper.like(LoginLog::getUsername, query.getKeyword());
        }
        wrapper.orderByDesc(LoginLog::getLoginTime);

        Page<LoginLog> logPage = loginLogMapper.selectPage(page, wrapper);
        return PageResult.of(logPage.getRecords(), logPage.getTotal(), query.getPageNum(), query.getPageSize());
    }

    @Override
    public void addLoginLog(LoginLog loginLog) {
        loginLogMapper.insert(loginLog);
    }
}