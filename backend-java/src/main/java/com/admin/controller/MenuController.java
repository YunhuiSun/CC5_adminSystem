package com.admin.controller;

import com.admin.entity.Menu;
import com.admin.service.MenuService;
import com.admin.common.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menu")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping("/list")
    public Result<List<Menu>> list() {
        return Result.success(menuService.getMenuList());
    }

    @PostMapping
    public Result<Void> add(@RequestBody Menu menu) {
        menuService.addMenu(menu);
        return Result.success();
    }

    @PutMapping
    public Result<Void> update(@RequestBody Menu menu) {
        menuService.updateMenu(menu);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return Result.success();
    }
}