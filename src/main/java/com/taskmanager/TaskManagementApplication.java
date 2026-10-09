package com.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class TaskManagementApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext ctx = SpringApplication.run(TaskManagementApplication.class, args);

        // Auto-open browser (reliable OS-specific method)
        new Thread(() -> {
            try {
                Thread.sleep(2000); // wait for server to fully start
                Environment env = ctx.getEnvironment();
                String port = env.getProperty("server.port", "8080");
                String url = "http://localhost:" + port;

                String os = System.getProperty("os.name").toLowerCase();
                ProcessBuilder pb;

                if (os.contains("win")) {
                    pb = new ProcessBuilder("cmd", "/c", "start", "", url);
                } else if (os.contains("mac")) {
                    pb = new ProcessBuilder("open", url);
                } else {
                    pb = new ProcessBuilder("xdg-open", url);
                }

                pb.start();
                System.out.println("\n✅ Browser opened: " + url + "\n");
            } catch (Exception e) {
                System.out.println("\n👉 Open manually: http://localhost:8080\n");
            }
        }).start();
    }
}