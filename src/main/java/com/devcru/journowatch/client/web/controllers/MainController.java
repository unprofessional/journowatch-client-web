package com.devcru.journowatch.client.web.controllers;

import static org.springframework.ui.freemarker.FreeMarkerTemplateUtils.processTemplateIntoString;

import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.devcru.journowatch.client.web.objects.User;

import freemarker.core.ParseException;
import freemarker.template.Configuration;
import freemarker.template.MalformedTemplateNameException;
import freemarker.template.TemplateException;
import freemarker.template.TemplateNotFoundException;

@Controller
@RequestMapping(value = "/*")
public class MainController {

	@Autowired
	private Configuration freemarkerConfiguration;

//	@RequestMapping(value = "/")
//	@ResponseStatus(HttpStatus.OK)
//	@ResponseBody
//	public String getIndex() throws TemplateNotFoundException, MalformedTemplateNameException, ParseException,
//			IOException, TemplateException {
//
//		System.out.println("root hit!");
//
//		return processTemplateIntoString(freemarkerConfiguration.getTemplate("sample.ftl"), new Object());
//	}

	@RequestMapping(value = "/")
	@ResponseStatus(HttpStatus.OK)
	public String getHome() {
		
		System.out.println("new root hit!");
		
		return "/resources/views/index.html";
	}

	@RequestMapping(value = "/index/{stuff}")
	@ResponseBody
	public String thing(@PathVariable("stuff") String stuff) throws TemplateNotFoundException,
			MalformedTemplateNameException, ParseException, IOException, TemplateException {

		System.out.println("/index/{" + stuff + "} has been hit!");

		return processTemplateIntoString(freemarkerConfiguration.getTemplate("sample.ftl"), new Object());
	}

	@RequestMapping(value = "/404")
	@ResponseStatus(HttpStatus.NOT_FOUND)
	// XXX: ^ Do we need this in the front-end.... maybe use only in the API?
	@ResponseBody
	public String get404() throws TemplateNotFoundException, MalformedTemplateNameException, ParseException,
			IOException, TemplateException {

		System.out.println("404 hit!");

		return processTemplateIntoString(freemarkerConfiguration.getTemplate("sample.ftl"), new Object());
	}

	@RequestMapping(value = "/resource")
	@ResponseBody
	public Map<String, Object> demoShit() {
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("id", UUID.randomUUID().toString());
		model.put("content", "Hello World");
		return model;
	}

//	@RequestMapping(value = "/user")
//	@ResponseBody
//	public User getUserData() {
//		User user = new User();
//		user.setUuid(UUID.randomUUID());
//		user.setUsername("regularsage");
//		user.setFirstName("regular");
//		user.setLastName("sage");
//		user.setPassword("password");
//		return user;
//	}
	
	@RequestMapping(value = "/user")
	@ResponseBody
	public Principal user(Principal user) {
		return user;
	}

	// TODO: Should we separate these into methods like getHeader() or
	// getFooter()?
	// If so, what is getMain()/getIndex()?

}
