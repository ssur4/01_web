CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_id VARCHAR(50) NOT NULL,
	password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(50),
    id_number VARCHAR(13) NOT NULL, -- 주민번호
    phone VARCHAR(18),
    address TEXT
);

CREATE TABLE Accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 기본값 현재 시간, 수정 시 자동 업데이트
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE AuthSalt (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    salt VARCHAR(500) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Users 테이블 생성
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_id INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(50),
    id_number VARCHAR(13) NOT NULL, -- 주민번호
    phone VARCHAR(18),
    address TEXT
);
    
    
    CREATE TABLE Accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    account_type VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- ////////////////////////// 데이터베이스 수정 ///////////////////////////////

-- Users 테이블 생성
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_id VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(50),
    id_number VARCHAR(13) NOT NULL, -- 주민번호
    phone VARCHAR(18),
    address TEXT
);

-- Accounts 테이블 생성
CREATE TABLE Accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    account_type VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- ************************ 데이터베이스 최종 수정 ****************************
USE workshop_0628;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL UNIQUE, -- 사용자 id
    password VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(20),
    id_number VARCHAR(13) NOT NULL, -- 주민번호
    phone VARCHAR(16),
    address TEXT
);

CREATE TABLE AuthSalt (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    salt VARCHAR(500) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);



CREATE TABLE Accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00, -- 현재 잔액
    account_type VARCHAR(10) NOT NULL, -- 계좌 유형
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
#     FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE Account 는 User 와 상관없이 데이터 남김
);

CREATE TABLE AccountHistory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL, -- 계좌 ID (외래 키)
    transaction_type VARCHAR(10) NOT NULL, -- 거래 유형 (입금 또는 출금)
    amount DECIMAL(15, 2) NOT NULL, -- 거래 금액
    balance DECIMAL(15, 2) NOT NULL, -- 거래 후 잔액
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 거래 시각
    description TEXT, -- 거래에 대한 설명
    FOREIGN KEY (account_id) REFERENCES Accounts(id) ON DELETE CASCADE
);








































# 외래키 제약조건 찾기
SELECT * FROM information_schema.table_constraints
WHERE TABLE_SCHEMA = 'workshop_0628'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY';
# 외래키 삭제
# ALTER TABLE AuthSalt DROP CONSTRAINT authsalt_ibfk_1;















    
    
    
    