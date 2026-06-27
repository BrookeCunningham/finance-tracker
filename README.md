# finance-tracker
Finance tracker developed with React, TypeScript, Node.js, Express, PostgreSQL, Prisma and JWT authentication.

# Development Planning
1. BACKEND

    - Database definition and CRUD operations (prisma)
        - USER - userid, name, email, password (hashed), createdAt
        - TRANSACTION - userid, plaidid (can be null), transactionid, value, payee, category, createdAt, description
        - BUDGET - userid, budgetid, category, budget value, createdAt

    - Create endpoints (import bank details, add/edit/delete expense)
        - REGISTER  POST /auth/register
        - SIGN IN   POST /auth/signin
        - LOGOUT    POST /auth/logout
        - VIEW USER GET /user/view
        - EDIT USER PUT /user/edit
        - DELETE USER   DELETE /user/delete
        - VIEW TRANSACTION GET /transaction/view
        - ADD TRANSACTION   POST /transaction/add
        - EDIT TRANSACTION  PUT /transaction/edit
        - DELETE TRANSACTION    DELETE /transaction/delete
        - VIEW BUDGET GET /budget/view
        - ADD BUDGET    POST /budget/add
        - EDIT BUDGET   PUT /budget/edit
        - DELETE BUDGET DELETE /budget/delete
        - BANK TOKEN  POST /plaid/create-link-token
        - CONNECT BANK  POST /plaid/exchange-token
        - BANK DETAILS POST /plaid/transactions
        
    - MVC approach
        server/
        ├── controllers/
        │   ├── authController.js
        │   ├── transactionController.js
        │   └── budgetController.js
        ├── routes/
        │   ├── authRoutes.js
        │   ├── transactionRoutes.js
        │   └── budgetRoutes.js
        ├── models/       (prisma)   
        └── server.js

        view : frontend/react
        
        Request comes in
            ↓
        Route (decides which controller handles it)
            ↓
        Controller (business logic)
            ↓
        Prisma/Model (database query)
            ↓
        Controller sends response back

    - Test with postman