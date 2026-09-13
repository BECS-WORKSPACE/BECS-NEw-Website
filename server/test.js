const bcrypt = require('bcryptjs'); bcrypt.compare('password123', '\$2b\$10\$k/RyUyFyp9ZjVQUfxeFO/eFuakIYIZU/m9EekcFOKxWjBTU2yz322').then(console.log);
