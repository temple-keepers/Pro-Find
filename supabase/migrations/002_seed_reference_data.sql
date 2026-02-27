-- ============================================
-- ProFind Guyana — Seed Reference Data
-- Run this AFTER the schema migration
-- ============================================

-- Seed Trades
INSERT INTO trades (id, name, local_name, icon, description, common_problems, sort_order) VALUES
('plumber', 'Plumber', 'Plumber', '🔧', 'Pipes, drains, taps, toilets, water tanks, bathroom and kitchen plumbing', ARRAY['Leaking pipe','Blocked drain','No hot water','Toilet not flushing','Low water pressure','Pipe burst','Bathroom renovation','Kitchen sink problem','Water tank issue','Tap dripping'], 1),
('electrician', 'Electrician', 'Electrician', '⚡', 'Wiring, lights, outlets, breakers, fans, generators, electrical repairs', ARRAY['Power outage in house','Lights flickering','Need new wiring','Breaker keeps tripping','Install ceiling fan','Outdoor lights','Generator hookup','Socket not working','Electrical burning smell','Need extra outlets'], 2),
('ac-technician', 'AC Technician', 'AC Man', '❄️', 'Air conditioning install, repair, servicing, and maintenance', ARRAY['AC not cooling','AC leaking water','AC making noise','Need AC installed','AC servicing','AC not turning on','AC smell bad','Split unit installation','AC remote not working'], 3),
('carpenter', 'Carpenter', 'Carpenter', '🪚', 'Furniture, cabinets, doors, windows, wooden structures, repairs', ARRAY['Build wardrobe','Fix door','Kitchen cabinets','Window frame repair','Wooden fence','Roof repair','Build shed','Furniture repair','Wooden stairs','Built-in shelves'], 4),
('mason', 'Mason / Builder', 'Mason', '🧱', 'Blocks, concrete, foundation, plastering, tiling, house construction', ARRAY['Build wall','Foundation work','Plastering','Tiling','Concrete work','House extension','Fix cracked wall','Build steps','Retaining wall','Column work'], 5),
('painter', 'Painter', 'Painter', '🎨', 'Interior and exterior painting, waterproofing, touch-ups', ARRAY['Paint house exterior','Paint interior rooms','Touch up work','Waterproofing','Paint fence or gate','Wall preparation','Remove old paint','Decorative painting'], 6),
('welder', 'Welder', 'Welder Man', '🔩', 'Gates, grills, fences, railings, burglar bars, metal fabrication', ARRAY['Build gate','Fix gate','Window grills','Metal fence','Burglar bars','Railing','Metal roof structure','Welding repair','Container modification','Staircase railing'], 7),
('mechanic', 'Mechanic', 'Mechanic', '🚗', 'Car repair, engine, brakes, AC, service, diagnostics', ARRAY['Car not starting','Engine trouble','Brake repair','Car AC not working','Oil change','Transmission problem','Tire change','General service','Check engine light','Suspension issue'], 8);

-- Seed Areas (Georgetown)
INSERT INTO areas (id, name, short_name, region, sort_order) VALUES
('gt-kitty', 'Kitty', 'Kitty', 'Georgetown', 1),
('gt-campbellville', 'Campbellville', 'Campbellville', 'Georgetown', 2),
('gt-sophia', 'Sophia', 'Sophia', 'Georgetown', 3),
('gt-albouystown', 'Albouystown', 'Albouystown', 'Georgetown', 4),
('gt-lacytown', 'Lacytown', 'Lacytown', 'Georgetown', 5),
('gt-bourda', 'Bourda', 'Bourda', 'Georgetown', 6),
('gt-subryanville', 'Subryanville', 'Subryanville', 'Georgetown', 7),
('gt-bel-air', 'Bel Air Park', 'Bel Air', 'Georgetown', 8),
('gt-stabroek', 'Stabroek', 'Stabroek', 'Georgetown', 9),
('gt-south-ruimveldt', 'South Ruimveldt', 'S. Ruimveldt', 'Georgetown', 10),
('gt-north-ruimveldt', 'North Ruimveldt', 'N. Ruimveldt', 'Georgetown', 11),
('gt-turkeyen', 'Turkeyen', 'Turkeyen', 'Georgetown', 12),
('gt-queenstown', 'Queenstown', 'Queenstown', 'Georgetown', 13),
('gt-werk-en-rust', 'Werk-en-Rust', 'Werk-en-Rust', 'Georgetown', 14),
('gt-lodge', 'Lodge', 'Lodge', 'Georgetown', 15),
('gt-cummingsburg', 'Cummingsburg', 'Cummingsburg', 'Georgetown', 16),
('gt-newtown', 'Newtown', 'Newtown', 'Georgetown', 17),
('gt-alexander-village', 'Alexander Village', 'Alex Village', 'Georgetown', 18),
('gt-roxanne-burnham', 'Roxanne Burnham Gardens', 'RB Gardens', 'Georgetown', 19);

-- Seed Areas (East Bank Demerara)
INSERT INTO areas (id, name, short_name, region, sort_order) VALUES
('ebd-providence', 'Providence', 'Providence', 'East Bank Demerara', 1),
('ebd-eccles', 'Eccles', 'Eccles', 'East Bank Demerara', 2),
('ebd-houston', 'Houston', 'Houston', 'East Bank Demerara', 3),
('ebd-diamond', 'Diamond', 'Diamond', 'East Bank Demerara', 4),
('ebd-grove', 'Grove', 'Grove', 'East Bank Demerara', 5),
('ebd-land-of-canaan', 'Land of Canaan', 'Canaan', 'East Bank Demerara', 6),
('ebd-herstelling', 'Herstelling', 'Herstelling', 'East Bank Demerara', 7),
('ebd-soesdyke', 'Soesdyke', 'Soesdyke', 'East Bank Demerara', 8),
('ebd-timehri', 'Timehri', 'Timehri', 'East Bank Demerara', 9);

-- Seed Areas (East Coast Demerara)
INSERT INTO areas (id, name, short_name, region, sort_order) VALUES
('ecd-ogle', 'Ogle', 'Ogle', 'East Coast Demerara', 1),
('ecd-plaisance', 'Plaisance', 'Plaisance', 'East Coast Demerara', 2),
('ecd-bv', 'BV (Beterverwagting)', 'BV', 'East Coast Demerara', 3),
('ecd-buxton', 'Buxton', 'Buxton', 'East Coast Demerara', 4),
('ecd-enmore', 'Enmore', 'Enmore', 'East Coast Demerara', 5),
('ecd-lbi', 'LBI (La Bonne Intention)', 'LBI', 'East Coast Demerara', 6),
('ecd-lusignan', 'Lusignan', 'Lusignan', 'East Coast Demerara', 7),
('ecd-success', 'Success', 'Success', 'East Coast Demerara', 8),
('ecd-mon-repos', 'Mon Repos', 'Mon Repos', 'East Coast Demerara', 9),
('ecd-triumph', 'Triumph', 'Triumph', 'East Coast Demerara', 10),
('ecd-cove-john', 'Cove & John', 'Cove & John', 'East Coast Demerara', 11);

-- Seed Areas (West Coast Demerara)
INSERT INTO areas (id, name, short_name, region, sort_order) VALUES
('wcd-vreed-en-hoop', 'Vreed-en-Hoop', 'Vreed-en-Hoop', 'West Coast Demerara', 1),
('wcd-wales', 'Wales', 'Wales', 'West Coast Demerara', 2),
('wcd-leonora', 'Leonora', 'Leonora', 'West Coast Demerara', 3),
('wcd-uitvlugt', 'Uitvlugt', 'Uitvlugt', 'West Coast Demerara', 4),
('wcd-parika', 'Parika', 'Parika', 'West Coast Demerara', 5);

-- Seed Areas (West Bank Demerara)
INSERT INTO areas (id, name, short_name, region, sort_order) VALUES
('wbd-la-grange', 'La Grange', 'La Grange', 'West Bank Demerara', 1),
('wbd-la-parfaite', 'La Parfaite Harmonie', 'La Parfaite', 'West Bank Demerara', 2);

-- Seed Areas (Berbice)
INSERT INTO areas (id, name, short_name, region, sort_order) VALUES
('ber-new-amsterdam', 'New Amsterdam', 'New Amsterdam', 'Berbice', 1),
('ber-rose-hall', 'Rose Hall', 'Rose Hall', 'Berbice', 2),
('ber-corriverton', 'Corriverton', 'Corriverton', 'Berbice', 3);

-- Seed Areas (Essequibo)
INSERT INTO areas (id, name, short_name, region, sort_order) VALUES
('ess-anna-regina', 'Anna Regina', 'Anna Regina', 'Essequibo', 1),
('ess-bartica', 'Bartica', 'Bartica', 'Essequibo', 2);

-- Seed Areas (Linden)
INSERT INTO areas (id, name, short_name, region, sort_order) VALUES
('lin-linden', 'Linden', 'Linden', 'Linden', 1);
