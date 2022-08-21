package com.wolf.controller.utils;


import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5Util { // 密码加密

    public  final static String pwdEncode = "@@gph";

   public static String mdtEncoding(String pwd){

       String str = null;
       try {
           MessageDigest md5 = MessageDigest.getInstance("MD5");
           md5.update(pwd.getBytes());
           byte[] bytes = md5.digest();
           str = new BigInteger(1,bytes).toString(16);
       } catch (NoSuchAlgorithmException e) {
           e.printStackTrace();
       }

       return str; // 返回加密后的密码

   }

}
