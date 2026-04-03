package com.admin.common;

import lombok.Data;

@Data
public class PageQuery {
    private Long pageNum = 1L;
    private Long pageSize = 10L;
    private String keyword;
}
