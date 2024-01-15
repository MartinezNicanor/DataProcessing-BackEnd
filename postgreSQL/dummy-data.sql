-- 1.0 Dummy data for netflix database for testing the database connection with TypeScript

INSERT INTO Country (country_name) VALUES
('United States'),
('Canada'),
('Germany'),
('Japan'),
('Australia');


-- Subscription table dummy data
INSERT INTO public.subscription (subscription_id, title, description, subscription_price) VALUES (0, 'free', 'free', 0);
INSERT INTO public.subscription (subscription_id, title, description, subscription_price) VALUES (1, 'sd', 'sd', 7.99);
INSERT INTO public.subscription (subscription_id, title, description, subscription_price) VALUES (2, 'hd', 'hd', 10.99);
INSERT INTO public.subscription (subscription_id, title, description, subscription_price) VALUES (3, 'uhd', 'uhd', 13.99);
