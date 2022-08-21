package com.wolf.controller.utils;

public class Result<T> { // 封装json数据实体类
    private Boolean flag;//  执行结果
    private Object data; // 数据
    private String msg; // 返回消息

    public Result() {
    }

    public Result(String msg) {
     this.msg = msg;
    }

    public Result(boolean flag, String msg) {
        this.flag = flag;
        this.msg = msg;
    }

    public Result(Boolean flag, Object data, String msg) {
        this.flag = flag;
        this.data = data;
        this.msg = msg;
    }


    public Boolean getFlag() {
        return flag;
    }

    public void setFlag(Boolean flag) {
        this.flag = flag;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
