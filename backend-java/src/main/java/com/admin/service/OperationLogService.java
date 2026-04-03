package com.admin.service;

import com.admin.entity.OperationLog;
import com.admin.common.PageQuery;
import com.admin.common.PageResult;

public interface OperationLogService {
    PageResult<OperationLog> getOperationLogList(PageQuery query);
    void addOperationLog(OperationLog operationLog);
}