package com.admin.service;

import com.admin.entity.LoginLog;
import com.admin.common.PageQuery;
import com.admin.common.PageResult;

public interface LoginLogService {
    PageResult<LoginLog> getLoginLogList(PageQuery query);
    void addLoginLog(LoginLog loginLog);
}