package com.wolf.domain;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User { // 用户实体类

    private Integer id;
    private String name;
    private String pwd;
    private String realName;
//    private String email;
    private String phone;
    private String createTime;

}
