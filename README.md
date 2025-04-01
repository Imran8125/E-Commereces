# 🛂 E-Commerce

A modern e-commerce platform built with Java.  

## 🌟 Overview  

This project implements a robust e-commerce solution with modern architecture and best practices.  

## 🚀 Features  

- 🏷️ **Product Management**  
- 🛒 **Shopping Cart Functionality**  
- 📦 **Order Processing**  
- 📊 **Inventory Management**  

## 💂 Project Structure  

```
src/
├── main/
│   ├── java/
│   │   └── com/ecommerce/
│   │       ├── controllers/
│   │       ├── models/
│   │       ├── repositories/
│   │       ├── services/
│   │       └── utils/
│   └── resources/
│       └── application.properties
```

## 🔗 API Endpoints  

### 🏷️ Products  
- 📝 `GET /api/products` - List all products  
- 🔍 `GET /api/products/{id}` - Get product details  
- ➕ `POST /api/products` - Create product  
- ✏️ `PUT /api/products/{id}` - Update product  
- ❌ `DELETE /api/products/{id}` - Delete product  

### 🛒 Cart  
- 👀 `GET /api/cart` - View cart  
- ➕ `POST /api/cart/items` - Add item to cart  
- 🛢️ `DELETE /api/cart/items/{id}` - Remove item  

## 🛠️ Technologies  

- ☕ **Java 17**  
- 🌱 **Spring Boot 3.1.3**  
- 🛄 **Database: H2-Database**  
- ⚡ **Gradle**  
- 🎨 **HTML, CSS, JavaScript**  

## 🏁 Getting Started  

1️⃣ **Clone the repository**  
```bash
git clone https://github.com/username/E-Commerces.git
```

2️⃣ **Configure database in `application.properties`**  
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=password
```

3️⃣ **Build and run**  
```bash
gradle install
gradle bootrun
```  

🚀 **Enjoy building your e-commerce platform!** 🎉
