package com.wolf.controller.utils;


import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// 异常处理器
@RestControllerAdvice
public class ProjectExceptionService {

    @ExceptionHandler
    public Result doException(Exception e) {
    e.printStackTrace();
    return new Result("服务器故障,请稍后再试!");
    }

}
