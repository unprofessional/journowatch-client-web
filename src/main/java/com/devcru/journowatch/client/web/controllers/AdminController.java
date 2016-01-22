package com.devcru.journowatch.client.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import freemarker.template.Configuration;

@Controller
@RequestMapping(value="/admin/*")
public class AdminController {
	
	@Autowired
	private Configuration freemarkerConfiguration;
	
	@RequestMapping(value="/portal")
	public String getAdminView() {
		System.out.println("/admin/portal has been hit!");
		return "/resources/views/admin-portal.html";
	}

}
