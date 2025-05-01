document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signup-form");
    const errorMsg = document.getElementById("signup-error");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
  
      try {
        const res = await fetch("http://127.0.0.1:5000/api/v1.0/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
  
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Signup failed");
        }
  
        // Auto-login after signup (optional)
        const data = await res.json();
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
      } catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.classList.remove("hidden");
      }
    });
  });
  