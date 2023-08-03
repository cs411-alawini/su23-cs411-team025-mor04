DELIMITER $$
CREATE PROCEDURE MedalsAboveAverage(IN country_name VARCHAR(255))
BEGIN
    DECLARE country VARCHAR(255);
    DECLARE gold_medals INT;
    DECLARE silver_medals INT;
    DECLARE bronze_medals INT;
    DECLARE country_medals INT;
    DECLARE total_medals INT;
    DECLARE avg_medals DECIMAL(10, 2);
    DECLARE above_avg BOOLEAN;

    DECLARE done INT DEFAULT 0;
    DECLARE country_cursor CURSOR FOR
    SELECT NOC, Gold, Silver, Bronze
    FROM medals;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    SELECT Gold, Silver, Bronze INTO gold_medals, silver_medals, bronze_medals
    FROM medals
    WHERE NOC = country_name;
        
    SET country_medals = gold_medals + silver_medals + bronze_medals;
    SET total_medals = 0;
    SET avg_medals = 0;

    OPEN country_cursor;
        read_loop: LOOP
        	FETCH country_cursor INTO country, gold_medals, silver_medals, bronze_medals;
        	IF done THEN
                LEAVE read_loop;
        	END IF;

        	SET total_medals = total_medals + gold_medals + silver_medals + bronze_medals;
        	SET avg_medals = avg_medals + 1;
        END LOOP;
    CLOSE country_cursor;

    SET avg_medals = total_medals / avg_medals;

    IF country_medals > avg_medals THEN
        SET above_avg = TRUE;
    ELSE
        SET above_avg = FALSE;
    END IF;

    SELECT above_avg;

END$$
DELIMITER ;
