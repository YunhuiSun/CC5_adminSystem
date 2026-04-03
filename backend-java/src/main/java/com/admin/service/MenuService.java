package com.admin.service;

import com.admin.entity.Menu;

import java.util.List;

public interface MenuService {
    List<Menu> getMenuList();
    void addMenu(Menu menu);
    void updateMenu(Menu menu);
    void deleteMenu(Long id);
}