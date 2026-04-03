package com.admin.controller;

import com.admin.entity.LoginLog;
import com.admin.entity.OperationLog;
import com.admin.service.LoginLogService;
import com.admin.service.OperationLogService;
import com.admin.common.PageQuery;
import com.admin.common.PageResult;
import com.admin.common.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/log")
public class LogController {

    @Autowired
    private LoginLogService loginLogService;

    @Autowired
    private OperationLogService operationLogService;

    @GetMapping("/login")
    public Result<PageResult<LoginLog>> loginLog(PageQuery query) {
        return Result.success(loginLogService.getLoginLogList(query));
    }

    @GetMapping("/operation")
    public Result<PageResult<OperationLog>> operationLog(PageQuery query) {
        return Result.success(operationLogService.getOperationLogList(query));
    }
}