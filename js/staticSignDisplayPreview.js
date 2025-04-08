window.addEventListener("load", (event) => {
    setTimeout(function() {
        document.getElementById("Sign2").setAttribute("src", "/src/public/StaticSignDisplay/sign2.html");
        setTimeout(function() {
            document.getElementById("Sign3").setAttribute("src", "/src/public/StaticSignDisplay/sign3.html");
            setTimeout(function() {
                document.getElementById("Sign4").setAttribute("src", "/src/public/StaticSignDisplay/sign4.html");
                setTimeout(function() {
                    document.getElementById("Sign5").setAttribute("src", "/src/public/StaticSignDisplay/sign5.html");
					setTimeout(function() {
                    document.getElementById("Sign6").setAttribute("src", "/src/public/StaticSignDisplay/sign6.html");
						setTimeout(function() {
							document.getElementById("wait").style.display = "none";
						  }, 2000);
					}, 300);
                  }, 300);
              }, 300);
          }, 300);
      }, 300);
  });