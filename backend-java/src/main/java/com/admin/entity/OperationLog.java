package com.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("sys_operation_log")
public class OperationLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String username;
    private String module;
    private String type;
    private String description;
    private String requestMethod;
    private String requestUrl;
    private String requestParams;
    private String responseData;
    private String ip;
    private Integer duration;
    private Integer status;
    private String errorMsg;
    private LocalDateTime createTime;
}