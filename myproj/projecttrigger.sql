DELIMITER $$

CREATE TRIGGER NewSport BEFORE INSERT ON athletes FOR EACH ROW
BEGIN
	SET @nocCount = (SELECT COUNT(NOC) FROM athletes WHERE NOC=NEW.NOC);
	
	IF @nocCount = 0
		BEGIN
			INSERT INTO coaches (Name, NOC, Discipline) VALUES (NEW.Name, NEW.NOC, NEW.Discipline);
			INSERT INTO medals (NOC, Gold, Silver, Bronze, Total) VALUES (NEW.NOC, 0, 0, 0, 0);
		END
	END IF;
END$$

DELIMITER ;

 