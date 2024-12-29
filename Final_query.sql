select * from user;
select* from property;
select* from appointment;
select* from offer;
select* from rating;
select * from message;

CREATE DataBase nextaura;
-- Table: User
CREATE TABLE User (
    User_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    User_name VARCHAR(50) not null,
    Email VARCHAR(50) not null,
    password VARCHAR(255) not null,
    Role VARCHAR(20) not null,
    Contact_info VARCHAR(50),
    profile_pic BLOB
);
-- Table: Property
CREATE TABLE Property (
    Property_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    Property_title VARCHAR(50) not null,
    Description VARCHAR(255),
    location VARCHAR(50) not null,
    price DECIMAL(10, 2) not null,
    size INTEGER not null,
    type VARCHAR(20) not null,
    posting_date DATE not null,
    seller_id INTEGER not null
);
-- Table: Offer
CREATE TABLE Offer (
    Offer_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    Property_id INTEGER not null,
    Buyer_id INTEGER,
    Seller_id INTEGER not null,
    Offer_price DECIMAL not null,
    Status VARCHAR(20),
    Date DATE
);
-- Table: Appointment
CREATE TABLE Appointment (
    Appointment_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    buyer_id INTEGER not null,
    seller_id INTEGER not null,
    appointment_date DATE not null,
    status VARCHAR(20),
    Property_id INTEGER not null
);
-- Table: Calendar
CREATE TABLE Calendar (
    Calendar_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    Appointment_id INTEGER not null,
    time_slot TIME not null
);
-- Table: Message
CREATE TABLE Message (
    Msg_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    Sender_id INTEGER not null,
    Property_id INTEGER not null,
    msg_content VARCHAR(255),
    timestamp DATETIME
);

CREATE TABLE rating (
    rating_id INT PRIMARY KEY auto_increment,
    user_id INT,
    property_id INT,                               
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL, 
    FOREIGN KEY (property_id) REFERENCES property(Property_id),
    FOREIGN KEY (user_id) REFERENCES user(User_id) 
);
-- For Offer table
ALTER TABLE Offer
ADD CONSTRAINT FK_Offer_Property FOREIGN KEY (Property_id) REFERENCES Property(Property_id),
ADD CONSTRAINT FK_Offer_Buyer FOREIGN KEY (Buyer_id) REFERENCES User(User_id),
ADD CONSTRAINT FK_Offer_Seller FOREIGN KEY (Seller_id) REFERENCES User(User_id);

-- For Appointment table
ALTER TABLE Appointment
ADD CONSTRAINT FK_buyer FOREIGN KEY (buyer_id) REFERENCES User(User_id),
ADD CONSTRAINT FK_seller FOREIGN KEY (seller_id) REFERENCES User(User_id),
ADD CONSTRAINT FK_Appointment_Property FOREIGN KEY (Property_id) REFERENCES Property(Property_id);

-- For Calendar table
ALTER TABLE Calendar
ADD CONSTRAINT FK_Calendar_Appointment FOREIGN KEY (Appointment_id) REFERENCES Appointment(Appointment_id);

ALTER TABLE Message
ADD CONSTRAINT FK_Message_Sender FOREIGN KEY (Sender_id) REFERENCES User(User_id),
ADD CONSTRAINT FK_Message_Property FOREIGN KEY (Property_id) REFERENCES Property(Property_id);


DELIMITER $$

CREATE TRIGGER UpdateAppointmentStatus
AFTER UPDATE ON Appointment
FOR EACH ROW
BEGIN
    IF NEW.appointment_date < CURDATE() AND NEW.status != 'Completed' THEN
        UPDATE Appointment
        SET status = 'Completed'
        WHERE Appointment_id = NEW.Appointment_id;
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER EnsureUniqueEmail
BEFORE INSERT ON User
FOR EACH ROW
BEGIN
    DECLARE email_count INT;
    SELECT COUNT(*) INTO email_count
    FROM User
    WHERE Email = NEW.Email;
    
    IF email_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Duplicate email not allowed.';
    END IF;
END $$

DELIMITER ;

-- DELIMITER $$

-- CREATE TRIGGER CreateDefaultOffer
-- AFTER INSERT ON Property
-- FOR EACH ROW
-- BEGIN
--     INSERT INTO Offer (Property_id, Seller_id, Offer_price, Status, Date)
--     VALUES (NEW.Property_id, NEW.seller_id, NEW.price, 'Pending', CURDATE());
-- END $$

-- DELIMITER ;

DELIMITER $$

CREATE TRIGGER RecordMessageTimestamp
BEFORE INSERT ON Message
FOR EACH ROW
BEGIN
    SET NEW.timestamp = CURRENT_TIME();
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER discard_rem_offers
AFTER UPDATE ON Offer
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Accepted' AND OLD.Status != 'Accepted' THEN
        UPDATE Offer
        SET Status = 'Rejected'
        WHERE Property_id = NEW.Property_id
        AND Offer_id != NEW.Offer_id
        AND Status != 'Accepted'; 
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER prevent_duplicate_rating
BEFORE INSERT ON rating
FOR EACH ROW
BEGIN
    -- Check if the combination of user_id and property_id already exists in the rating table
    IF EXISTS (
        SELECT 1
        FROM rating
        WHERE user_id = NEW.user_id
        AND property_id = NEW.property_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Duplicate rating for the same user and property.';
    END IF;
END $$

DELIMITER ;

-- Inserting 27 users (both buyers and sellers)
INSERT INTO User (User_name, Email, password, Role, Contact_info) VALUES
('John Adams', 'john.adams@example.com', 'password123', 'Seller', '123-456-7890'),
('Mary Johnson', 'mary.johnson@example.com', 'password123', 'Buyer', '234-567-8901'),
('Ethan Turner', 'ethan.turner@example.com', 'password123', 'Seller', '345-678-9012'),
('Olivia Scott', 'olivia.scott@example.com', 'password123', 'Buyer', '456-789-0123'),
('Liam Williams', 'liam.williams@example.com', 'password123', 'Admin', '567-890-1234'),
('Ava King', 'ava.king@example.com', 'password123', 'Buyer', '678-901-2345'),
('David Moore', 'david.moore@example.com', 'password123', 'Seller', '789-012-3456'),
('Sophia Lee', 'sophia.lee@example.com', 'password123', 'Buyer', '890-123-4567'),
('Daniel Martinez', 'daniel.martinez@example.com', 'password123', 'Admin', '901-234-5678'),
('Isabella Brown', 'isabella.brown@example.com', 'password123', 'Buyer', '012-345-6789'),
('Jack Green', 'jack.green@example.com', 'password123', 'Buyer', '023-456-7890'),
('Chloe Black', 'chloe.black@example.com', 'password123', 'Seller', '234-567-8902'),
('Mia White', 'mia.white@example.com', 'password123', 'Seller', '345-678-9013'),
('Mason Harris', 'mason.harris@example.com', 'password123', 'Admin', '456-789-0124'),
('Benjamin Davis', 'benjamin.davis@example.com', 'password123', 'Buyer', '567-890-1235'),
('Olivia Clark', 'olivia.clark@example.com', 'password123', 'Seller', '890-123-4569'),
('Henry Evans', 'henry.evans@example.com', 'password123', 'Seller', '901-234-5679'),
('Ella Moore', 'ella.moore@example.com', 'password123', 'Buyer', '987-654-3210'),
('Lucas Taylor', 'lucas.taylor@example.com', 'password123', 'Buyer', '876-543-2109'),
('Emma Carter', 'emma.carter@example.com', 'password123', 'Seller', '765-432-1098'),
('Matthew Reed', 'matthew.reed@example.com', 'password123', 'Buyer', '654-321-0987'),
('Isabella Gray', 'isabella.gray@example.com', 'password123', 'Buyer', '543-210-9876'),
('Amelia Lee', 'amelia.lee@example.com', 'password123', 'Seller', '432-109-8765'),
('Ethan Brooks', 'ethan.brooks@example.com', 'password123', 'Seller', '321-098-7654'),
('Grace Allen', 'grace.allen@example.com', 'password123', 'Buyer', '210-987-6543'),
('Mason Perez', 'mason.perez@example.com', 'password123', 'Seller', '109-876-5432');

-- Inserting 51 properties (linked to random sellers)
INSERT INTO Property (Property_title, Description, location, price, size, type, posting_date, seller_id) VALUES
('Spacious Beach House', '4-bedroom house with ocean views.', 'Miami, FL', 1800000.00, 3500, 'House', '2024-12-01', 1),
('Luxury Penthouse in NYC', 'Top-floor penthouse with rooftop access and skyline views.', 'New York, NY', 5500000.00, 4000, 'Apartment', '2024-11-15', 2),
('Modern Apartment', '2-bedroom apartment in downtown area.', 'San Francisco, CA', 850000.00, 1200, 'Apartment', '2024-11-20', 3),
('City Loft with View', 'Open concept loft with spectacular city views.', 'Chicago, IL', 1350000.00, 2000, 'Apartment', '2024-12-01', 5),
('Riverside Mansion', 'Luxury mansion by the river with a grand foyer.', 'Austin, TX', 4500000.00, 8000, 'Villa', '2024-11-22', 6),
('Suburban Family Home', '3-bedroom home in a family-friendly neighborhood.', 'Los Angeles, CA', 720000.00, 2200, 'House', '2024-12-02', 7),
('Cozy Cottage', '2-bedroom cottage near the beach.', 'Los Angeles, CA', 450000.00, 1200, 'House', '2024-12-01', 8),
('Luxury Villa with Pool', '5-bedroom villa with a swimming pool and private garden.', 'San Diego, CA', 2500000.00, 5000, 'Villa', '2024-12-01', 9),
('Charming Historic House', 'Restored 3-bedroom house in a historic district.', 'New Orleans, LA', 850000.00, 1800, 'House', '2024-11-30', 10),
('High-rise Apartment', '1-bedroom apartment with panoramic views of the city.', 'Seattle, WA', 700000.00, 900, 'Apartment', '2024-11-28', 11),
('Oceanfront Condo', '2-bedroom condo with stunning views of the beach.', 'Hawaii, HI', 2200000.00, 1600, 'Apartment', '2024-12-01', 13),
('Contemporary Townhouse', 'Modern 3-bedroom townhouse near shopping centers.', 'Portland, OR', 650000.00, 1800, 'House', '2024-11-21', 14),
('Exclusive Gated Estate', 'Private 5-bedroom estate with high-end finishes.', 'Beverly Hills, CA', 8000000.00, 9000, 'Villa', '2024-12-03', 15),
('Rustic Farmhouse', '4-bedroom farmhouse on a large plot of land.', 'Napa Valley, CA', 2500000.00, 3500, 'House', '2024-11-22', 16),
('Penthouse Loft', 'Stylish 2-bedroom penthouse with a spacious terrace.', 'San Francisco, CA', 3800000.00, 2500, 'Apartment', '2024-12-04', 17),
('Cozy Urban Condo', '1-bedroom condo in a bustling downtown location.', 'Austin, TX', 450000.00, 800, 'Apartment', '2024-11-25', 18),
('Chic Loft Apartment', 'Open-concept 2-bedroom loft with modern amenities.', 'Chicago, IL', 1350000.00, 2000, 'Apartment', '2024-12-01', 19),
('Luxury Estate on Lake', '7-bedroom estate with private dock on the lake.', 'Lake Tahoe, CA', 9500000.00, 11000, 'Villa', '2024-11-20', 20),
('Stylish Studio', 'Contemporary studio apartment in the heart of the city.', 'New York, NY', 650000.00, 600, 'Apartment', '2024-12-01', 21),
('Spacious Ranch', '5-bedroom ranch house on a sprawling property.', 'Dallas, TX', 4000000.00, 7000, 'House', '2024-11-28', 22),
('Designer Loft', 'Luxury 3-bedroom loft with floor-to-ceiling windows.', 'Miami, FL', 3200000.00, 3000, 'Apartment', '2024-11-25', 23),
('Classic Victorian', '4-bedroom Victorian-style house with modern upgrades.', 'San Francisco, CA', 2500000.00, 2500, 'House', '2024-12-03', 24),
('Stylish Modern Home', '3-bedroom home with sleek design and spacious yard.', 'Seattle, WA', 1600000.00, 2500, 'House', '2024-12-01', 25),
('Beautiful Family Home', '4-bedroom home with a large garden and modern kitchen.', 'Austin, TX', 950000.00, 2800, 'House', '2024-12-02', 26),
('Urban Luxury Apartment', 'High-end 2-bedroom apartment with city skyline views.', 'Los Angeles, CA', 2200000.00, 1800, 'Apartment', '2024-11-30', 27),
('Gated Suburban Home', '4-bedroom home in a gated community with a backyard.', 'Houston, TX', 850000.00, 2200, 'House', '2024-12-01', 28),
('City Penthouse', '5-bedroom penthouse with sweeping views of downtown.', 'New York, NY', 8000000.00, 4000, 'Apartment', '2024-11-20', 29),
('Rural Ranch House', '3-bedroom house on a vast rural property.', 'Phoenix, AZ', 950000.00, 3500, 'House', '2024-12-01', 30),
('Luxury Mountain Cabin', '4-bedroom cabin with amazing views of the mountains.', 'Boulder, CO', 1250000.00, 2200, 'House', '2024-11-28', 31),
('Oceanview Condo', '2-bedroom condo with a balcony overlooking the ocean.', 'San Diego, CA', 1800000.00, 1400, 'Apartment', '2024-12-02', 32),
('Exclusive Downtown Loft', 'Contemporary loft apartment in a historic building.', 'Chicago, IL', 1500000.00, 2200, 'Apartment', '2024-11-29', 33),
('Luxury Farmhouse', 'Beautiful 5-bedroom farmhouse with a barn.', 'Napa Valley, CA', 3500000.00, 6000, 'House', '2024-12-04', 34),
('Stylish Beach Condo', 'Modern 2-bedroom beach condo with a pool.', 'Miami Beach, FL', 2100000.00, 1600, 'Apartment', '2024-11-22', 35),
('Family-Friendly Home', '4-bedroom home in a quiet suburban neighborhood.', 'Denver, CO', 700000.00, 2400, 'House', '2024-12-03', 36),
('Luxury Ranch Estate', 'Large estate with ranch-style architecture and 6 bedrooms.', 'Dallas, TX', 5500000.00, 9000, 'House', '2024-12-01', 37),
('Oceanfront Villa', 'Private 5-bedroom villa with direct access to the beach.', 'Santa Barbara, CA', 8000000.00, 7000, 'Villa', '2024-11-25', 38),
('Contemporary Beach House', '3-bedroom house with breathtaking views of the ocean.', 'Malibu, CA', 4200000.00, 3500, 'House', '2024-12-02', 39),
('Modern Suburban House', '3-bedroom house with modern features and a large garden.', 'Phoenix, AZ', 550000.00, 2200, 'House', '2024-11-20', 40),
('Luxury Apartment with Pool', '3-bedroom apartment with a rooftop pool and gym.', 'Los Angeles, CA', 2400000.00, 1800, 'Apartment', '2024-11-15', 41),
('Rustic Lodge', '5-bedroom lodge in the mountains, perfect for a vacation getaway.', 'Aspen, CO', 2500000.00, 5000, 'House', '2024-12-01', 42),
('Modern Townhouse', '4-bedroom townhouse in a peaceful suburban neighborhood.', 'Portland, OR', 600000.00, 2200, 'House', '2024-11-30', 43),
('Stylish City Condo', '1-bedroom condo in the heart of the city with amenities.', 'Chicago, IL', 650000.00, 900, 'Apartment', '2024-11-28', 44),
('Gated Community Villa', 'Private villa in a gated community with 5 bedrooms.', 'San Diego, CA', 3200000.00, 5000, 'Villa', '2024-11-25', 45),
('Urban Loft Apartment', 'Loft apartment with a mix of modern and rustic design.', 'Seattle, WA', 1300000.00, 1800, 'Apartment', '2024-12-01', 46),
('Exclusive Lakefront Property', '5-bedroom property with lakefront access and private dock.', 'Lake Tahoe, CA', 7000000.00, 8000, 'House', '2024-11-20', 47),
('Private Mountain Retreat', 'Secluded 4-bedroom cabin in the mountains, ideal for nature lovers.', 'Denver, CO', 1050000.00, 1800, 'House', '2024-12-03', 48),
('Urban Luxury Residence', '2-bedroom luxury apartment in a prestigious downtown area.', 'Austin, TX', 2200000.00, 1800, 'Apartment', '2024-11-18', 49),
('Mountain Escape', '4-bedroom home with amazing views in the Colorado Rockies.', 'Boulder, CO', 2500000.00, 4000, 'House', '2024-11-15', 50),
('Penthouse with Terrace', '3-bedroom penthouse with a private rooftop terrace.', 'Los Angeles, CA', 4000000.00, 3000, 'Apartment', '2024-12-01', 51);

-- Inserting 31 random offers for properties
INSERT INTO Offer (Property_id, Buyer_id, Seller_id, Offer_price, Status, Date) VALUES
(1, 2, 1, 1750000.00, 'Pending', '2024-12-01'), -- Buyer 2 (Mary Johnson) for property 1 (Spacious Beach House)
(1, 3, 1, 1650000.00, 'Rejected', '2024-12-02'), -- Buyer 3 (Ethan Turner) for property 1 (Spacious Beach House)
(1, 4, 1, 1800000.00, 'Completed', '2024-12-03'), -- Buyer 4 (Olivia Scott) for property 1 (Spacious Beach House)
(2, NULL, 2, 5300000.00, 'Available', '2024-12-04'), -- No buyer, Seller 2 (John Adams) for property 2 (Luxury Penthouse in NYC)
(2, 5, 2, 5000000.00, 'Pending', '2024-12-01'), -- Buyer 5 (Liam Williams) for property 2 (Luxury Penthouse in NYC)
(3, 6, 3, 800000.00, 'Pending', '2024-11-25'), -- Buyer 6 (Ava King) for property 3 (Modern Apartment)
(3, 7, 3, 850000.00, 'Rejected', '2024-11-26'), -- Buyer 7 (Sophia Lee) for property 3 (Modern Apartment)
(4, NULL, 4, 900000.00, 'Available', '2024-11-28'), -- No buyer, Seller 4 (Ethan Turner) for property 4 (Mountain Cabin)
(4, 8, 4, 950000.00, 'Pending', '2024-12-01'), -- Buyer 8 (Chloe Black) for property 4 (Mountain Cabin)
(5, NULL, 5, 1400000.00, 'Available', '2024-12-01'), -- No buyer, Seller 5 (Liam Williams) for property 5 (City Loft with View)
(5, 9, 5, 1450000.00, 'Pending', '2024-12-02'), -- Buyer 9 (Isabella Brown) for property 5 (City Loft with View)
(6, 10, 6, 4200000.00, 'Pending', '2024-12-01'), -- Buyer 10 (Chloe Black) for property 6 (Riverside Mansion)
(7, NULL, 7, 720000.00, 'Available', '2024-12-03'), -- No buyer, Seller 7 (David Moore) for property 7 (Suburban Family Home)
(7, 11, 7, 750000.00, 'Pending', '2024-12-01'), -- Buyer 11 (Jack Green) for property 7 (Suburban Family Home)
(8, NULL, 8, 400000.00, 'Available', '2024-12-01'), -- No buyer, Seller 8 (Chloe Black) for property 8 (Cozy Cottage)
(8, 12, 8, 450000.00, 'Pending', '2024-12-03'), -- Buyer 12 (Isabella Gray) for property 8 (Cozy Cottage)
(9, NULL, 9, 2200000.00, 'Available', '2024-12-02'), -- No buyer, Seller 9 (David Moore) for property 9 (Luxury Villa with Pool)
(9, 13, 9, 2300000.00, 'Pending', '2024-12-01'), -- Buyer 13 (Benjamin Davis) for property 9 (Luxury Villa with Pool)
(10, 14, 10, 850000.00, 'Completed', '2024-12-01'), -- Buyer 14 (Lucas Taylor) for property 10 (Charming Historic House)
(10, 15, 10, 880000.00, 'Rejected', '2024-12-02'), -- Buyer 15 (Benjamin Davis) for property 10 (Charming Historic House)
(11, NULL, 11, 700000.00, 'Available', '2024-12-03'), -- No buyer, Seller 11 (Jack Green) for property 11 (High-rise Apartment)
(11, 16, 11, 750000.00, 'Pending', '2024-12-02'), -- Buyer 16 (Grace Allen) for property 11 (High-rise Apartment)
(12, NULL, 12, 3800000.00, 'Available', '2024-12-01'), -- No buyer, Seller 12 (Mason Harris) for property 12 (Luxury Mountain Retreat)
(12, 17, 12, 3900000.00, 'Pending', '2024-12-03'), -- Buyer 17 (Matthew Reed) for property 12 (Luxury Mountain Retreat)
(13, 18, 13, 1800000.00, 'Pending', '2024-12-02'), -- Buyer 18 (Olivia Clark) for property 13 (Oceanfront Condo)
(14, NULL, 14, 900000.00, 'Available', '2024-12-01'), -- No buyer, Seller 14 (Mia White) for property 14 (Contemporary Townhouse)
(14, 19, 14, 950000.00, 'Pending', '2024-12-04'), -- Buyer 19 (Lucas Taylor) for property 14 (Contemporary Townhouse)
(15, 20, 15, 5000000.00, 'Pending', '2024-11-28'), -- Buyer 20 (Henry Evans) for property 15 (Exclusive Gated Estate)
(16, 21, 16, 2300000.00, 'Pending', '2024-12-01'), -- Buyer 21 (Mason Harris) for property 16 (Rustic Farmhouse)
(17, 22, 17, 4000000.00, 'Pending', '2024-12-03'), -- Buyer 22 (Olivia Clark) for property 17 (Penthouse Loft)
(18, NULL, 18, 6000000.00, 'Available', '2024-12-01'), -- No buyer, Seller 18 (Grace Allen) for property 18 (Luxury Farmhouse)
(18, 23, 18, 6200000.00, 'Pending', '2024-12-03'); -- Buyer 23 (Matthew Reed) for property 18 (Luxury Farmhouse)

-- Inserting 17 random appointments (buyers and sellers)
INSERT INTO Appointment (buyer_id, seller_id, appointment_date, status, Property_id) VALUES
(2, 1, '2024-12-01', 'Completed', 1), -- Buyer 2 (Mary Johnson) and Seller 1 (John Adams) completed appointment for property 1 (Spacious Beach House)
(4, 3, '2024-12-10', 'Scheduled', 2), -- Buyer 4 (Olivia Scott) and Seller 3 (Ethan Turner) scheduled appointment for property 2 (Luxury Penthouse in NYC)
(5, 7, '2024-11-20', 'Completed', 3), -- Buyer 5 (Liam Williams) and Seller 7 (David Moore) completed appointment for property 3 (Modern Apartment)
(6, 4, '2024-11-22', 'Completed', 4), -- Buyer 6 (Ava King) and Seller 4 (Ethan Turner) completed appointment for property 4 (Mountain Cabin)
(2, 8, '2024-12-04', 'Scheduled', 5), -- Buyer 2 (Mary Johnson) and Seller 8 (Chloe Black) scheduled appointment for property 5 (City Loft with View)
(4, 5, '2024-12-02', 'Scheduled', 6), -- Buyer 4 (Olivia Scott) and Seller 5 (Liam Williams) scheduled appointment for property 6 (Riverside Mansion)
(3, 6, '2024-11-18', 'Completed', 7), -- Buyer 3 (Ethan Turner) and Seller 6 (David Moore) completed appointment for property 7 (Suburban Family Home)
(7, 10, '2024-12-06', 'Scheduled', 8), -- Buyer 7 (Sophia Lee) and Seller 10 (Isabella Brown) scheduled appointment for property 8 (Cozy Cottage)
(8, 9, '2024-12-08', 'Scheduled', 9), -- Buyer 8 (Sophia Lee) and Seller 9 (David Moore) scheduled appointment for property 9 (Luxury Villa with Pool)
(6, 11, '2024-11-25', 'Completed', 10), -- Buyer 6 (Ava King) and Seller 11 (Jack Green) completed appointment for property 10 (Charming Historic House)
(9, 12, '2024-12-07', 'Scheduled', 11), -- Buyer 9 (Isabella Brown) and Seller 12 (Mason Harris) scheduled appointment for property 11 (High-rise Apartment)
(2, 12, '2024-12-10', 'Scheduled', 12), -- Buyer 2 (Mary Johnson) and Seller 12 (Mason Harris) scheduled appointment for property 12 (Luxury Mountain Retreat)
(10, 14, '2024-11-28', 'Completed', 13), -- Buyer 10 (Chloe Black) and Seller 14 (Mia White) completed appointment for property 13 (Oceanfront Condo)
(11, 13, '2024-12-15', 'Scheduled', 14), -- Buyer 11 (Jack Green) and Seller 13 (Olivia Clark) scheduled appointment for property 14 (Contemporary Townhouse)
(15, 16, '2024-11-19', 'Completed', 15), -- Buyer 15 (Benjamin Davis) and Seller 16 (Henry Evans) completed appointment for property 15 (Exclusive Gated Estate)
(12, 17, '2024-12-01', 'Scheduled', 16), -- Buyer 12 (Isabella Gray) and Seller 17 (Grace Allen) scheduled appointment for property 16 (Rustic Farmhouse)
(17, 18, '2024-12-09', 'Scheduled', 17); -- Buyer 17 (Matthew Reed) and Seller 18 (Lucas Taylor) scheduled appointment for property 17 (Penthouse Loft)

-- Inserting calendar time slots for appointments
INSERT INTO Calendar (Appointment_id, time_slot) VALUES
(1, '10:00:00'),  -- Appointment 1 (Seller 1)
(2, '11:00:00'),  -- Appointment 2 (Seller 2)
(3, '12:00:00'),  -- Appointment 3 (Seller 3)
(4, '14:00:00'),  -- Appointment 4 (Seller 4)
(5, '15:00:00'),  -- Appointment 5 (Seller 5)
(6, '16:00:00'),  -- Appointment 6 (Seller 6)
(7, '10:30:00'),  -- Appointment 7 (Seller 7)
(8, '11:30:00'),  -- Appointment 8 (Seller 8)
(9, '12:30:00'),  -- Appointment 9 (Seller 9)
(10, '14:30:00'), -- Appointment 10 (Seller 10)
(11, '15:30:00'), -- Appointment 11 (Seller 11)
(12, '16:30:00'), -- Appointment 12 (Seller 12)
(13, '17:00:00'), -- Appointment 13 (Seller 1)
(14, '17:30:00'), -- Appointment 14 (Seller 2)
(15, '18:00:00'), -- Appointment 15 (Seller 3)
(16, '18:30:00'), -- Appointment 16 (Seller 4)
(17, '19:00:00'); -- Appointment 17 (Seller 5)

-- Inserting random messages (comments) for properties
-- Inserting 27 messages 
INSERT INTO Message (Sender_id, Property_id, msg_content, timestamp) VALUES
(1, 1, 'Hello, I am interested in your beach house. Can we schedule a viewing?', '2024-12-02 14:30:00'),
(2, 1, 'Hi, thank you for reaching out! I will check my schedule and let you know.', '2024-12-03 09:15:00'),
(3, 2, 'Hi, the penthouse in NYC looks amazing. Could you share more details about the amenities?', '2024-12-01 11:45:00'),
(4, 2, 'Of course! It has a rooftop pool, 24/7 concierge service, and gym facilities.', '2024-12-02 16:00:00'),
(5, 3, 'I am interested in the modern apartment in San Francisco. When is the next available viewing?', '2024-12-03 10:00:00'),
(6, 3, 'It is available for viewing this weekend. Let me know if you are free!', '2024-12-04 12:30:00'),
(7, 4, 'Hi, I have a family and am interested in the suburban home in Los Angeles. Could you give me more details?', '2024-12-01 13:15:00'),
(8, 4, 'The home is in a family-friendly neighborhood with a large backyard. Would you like to schedule a visit?', '2024-12-02 10:45:00'),
(9, 5, 'The riverside mansion looks incredible. I would love to know more about the surrounding area and amenities.', '2024-11-30 17:00:00'),
(10, 5, 'It is in a quiet area by the river, and the mansion comes with a large pool and guest house.', '2024-12-01 08:30:00'),
(11, 6, 'I’m interested in the oceanfront condo in Hawaii. Could you provide more photos?', '2024-11-28 14:15:00'),
(12, 6, 'Sure, I’ll send you more photos of the condo. Let me know if you want to schedule a visit.', '2024-12-01 10:00:00'),
(13, 7, 'I am looking for a historic house. Would the one in New Orleans be suitable for my needs?', '2024-12-01 15:30:00'),
(14, 7, 'It’s a restored Victorian-style house with original features. Would you like to visit this weekend?', '2024-12-02 09:00:00'),
(15, 8, 'The exclusive gated estate in Beverly Hills is exactly what I’m looking for. Can I get more details on the interior?', '2024-12-03 13:00:00'),
(16, 8, 'The estate has an expansive living room and marble floors. Would you like to tour it soon?', '2024-12-04 11:30:00'),
(17, 9, 'Hi, I am interested in the luxury villa with a pool. Could you share more details about the layout?', '2024-12-02 12:45:00'),
(18, 9, 'It has five bedrooms, including a master suite with a jacuzzi. I can send you a floor plan.', '2024-12-03 14:30:00'),
(19, 10, 'I saw the luxury estate on Lake Tahoe and I’m interested. Could you provide details on the outdoor features?', '2024-12-02 10:30:00'),
(20, 10, 'The estate includes a private dock, boat access, and a garden with a gazebo.', '2024-12-03 16:00:00'),
(21, 11, 'The stylish studio in New York looks great. Is it still available for rent?', '2024-12-01 12:00:00'),
(22, 11, 'Yes, the studio is still available. It’s perfect for someone looking for a cozy, downtown location.', '2024-12-02 09:45:00'),
(23, 12, 'I’m interested in the penthouse loft in San Francisco. When is it available for a viewing?', '2024-12-01 16:30:00'),
(24, 12, 'It’s available for viewing this weekend. Let me know when you’re free!', '2024-12-02 17:30:00'),
(25, 13, 'I’m really interested in your chic loft apartment in Chicago. Can I get more details on parking availability?', '2024-12-01 14:00:00'),
(26, 13, 'Yes, the loft comes with a reserved parking spot in the building’s garage.', '2024-12-03 13:00:00');

-- Inserting 24 random ratings for properties (between 1 to 5)
INSERT INTO rating (user_id, property_id, rating) VALUES
(1, 1, 5),  -- John Adams rates 'Spacious Beach House'
(2, 2, 4),  -- Mary Johnson rates 'Luxury Penthouse in NYC'
(3, 3, 3),  -- Ethan Turner rates 'Modern Apartment'
(4, 4, 4),  -- Olivia Scott rates 'City Loft with View'
(5, 5, 5),  -- Liam Williams rates 'Riverside Mansion'
(6, 6, 2),  -- Ava King rates 'Suburban Family Home'
(7, 7, 5),  -- David Moore rates 'Cozy Cottage'
(8, 8, 3),  -- Sophia Lee rates 'Luxury Villa with Pool'
(9, 9, 4),  -- Daniel Martinez rates 'Charming Historic House'
(10, 10, 3), -- Isabella Brown rates 'High-rise Apartment'
(11, 11, 4), -- Jack Green rates 'Oceanfront Condo'
(12, 12, 5), -- Chloe Black rates 'Contemporary Townhouse'
(13, 13, 2), -- Mia White rates 'Exclusive Gated Estate'
(14, 14, 4), -- Mason Harris rates 'Rustic Farmhouse'
(15, 15, 5), -- Benjamin Davis rates 'Penthouse Loft'
(16, 16, 4), -- Olivia Clark rates 'Cozy Urban Condo'
(17, 17, 3), -- Henry Evans rates 'Chic Loft Apartment'
(18, 18, 4), -- Ella Moore rates 'Luxury Estate on Lake'
(19, 19, 5), -- Lucas Taylor rates 'Stylish Studio'
(20, 20, 4), -- Emma Carter rates 'Spacious Ranch'
(21, 21, 2), -- Matthew Reed rates 'Designer Loft'
(22, 22, 3), -- Isabela Gray rates 'Classic Victorian'
(23, 23, 4), -- Amelia Lee rates 'Stylish Modern Home'
(24, 24, 5); -- Ethan Brooks rates 'Beautiful Family Home'





