package com.admin.service.impl;

import com.admin.entity.OperationLog;
import com.admin.mapper.OperationLogMapper;
import com.admin.service.OperationLogService;
import com.admin.common.PageQuery;
import com.admin.common.PageResult;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OperationLogServiceImpl implements OperationLogService {

    @Autowired
    private OperationLogMapper operationLogMapper;

    @Override
    public PageResult<OperationLog> getOperationLogList(PageQuery query) {
        Page<OperationLog> page = new Page<>(query.getPageNum(), query.getPageSize());
        LambdaQueryWrapper<OperationLog> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(OperationLog::getCreateTime);

        Page<OperationLog> logPage = operationLogMapper.selectPage(page, wrapper);
        return PageResult.of(logPage.getRecords(), logPage.getTotal(), query.getPageNum(), query.getPageSize());
    }

    @Override
    public void addOperationLog(OperationLog operationLog) {
        operationLogMapper.insert(operationLog);
    }
}