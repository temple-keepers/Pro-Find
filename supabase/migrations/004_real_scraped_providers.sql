-- ============================================
-- ProFind Guyana — REAL Scraped Providers
-- Sources: GCCI, Expat.com, VyMaps, Google, GuyanaElectric.com,
--          GuyanaIndex.com, FindYello.com, WhoDoYou.com
-- Date: February 2026
-- REVIEW before importing — verify phones are current
-- ============================================

-- Allow NULL phones for scraped providers where phone is unknown
ALTER TABLE providers ALTER COLUMN phone DROP NOT NULL;
-- ============================================

-- S&L Electrical Agency — Kitty, Georgetown
-- Source: VyMaps / Google Maps
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'S&L Electrical Agency',
  '2263018',
  ARRAY['electrician'],
  ARRAY['gt-kitty'],
  'Electrical agency at 179-180 Thomas St, Kitty, Georgetown. Importers and distributors of quality electrical products including HTC, Philips, Leviton, TCL, Crabtree. Founded 1992. Open Mon-Fri 8AM-4PM, Sat 8AM-12PM.',
  'google_maps',
  'VyMaps listing — 179-180 Thomas St, Kitty',
  false,
  ARRAY['Electrical supplies', 'Electrical installation', 'Wiring']
) ON CONFLICT DO NOTHING;

-- Guyana Electric — East LePenitence, Georgetown
-- Source: Expat.com + GuyanaElectric.com
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Guyana Electric',
  '6159420',
  ARRAY['electrician'],
  ARRAY['gt-lacytown', 'gt-kitty', 'gt-campbellville'],
  '24/7 emergency electrical service. Licensed and qualified electricians. Circuit breaker repair, flickering lights diagnosis, wiring inspection. Available around the clock for emergencies.',
  'web_scrape',
  'Expat.com + guyanaelectric.com — 159 Guyhoc Park, Arapaima St, East LePenitence',
  false,
  ARRAY['Emergency electrical', 'Circuit breaker repair', 'Wiring inspection', 'Electrical safety', 'Light installation']
) ON CONFLICT DO NOTHING;

-- Jason''s Electrical Wiring — Kitty, Georgetown
-- Source: Expat.com
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Jason''s Electrical Wiring',
  '6146745',
  ARRAY['electrician'],
  ARRAY['gt-kitty'],
  'Electrical wiring services. Located at 220 Lamaha Street, Kitty, Georgetown. 1 recommendation on Expat.com.',
  'web_scrape',
  'Expat.com listing — 220 Lamaha Street, Kitty',
  false,
  ARRAY['House wiring', 'Electrical installation']
) ON CONFLICT DO NOTHING;

-- MJ''s Electrical & Air Conditioning Services — East Ruimveldt
-- Source: VyMaps
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'MJ''s Electrical & Air Conditioning Services',
  NULL,
  ARRAY['electrician', 'ac-technician'],
  ARRAY['gt-north-ruimveldt'],
  'Electrical and AC services at 281 East Ruimveldt, Georgetown.',
  'web_scrape',
  'VyMaps listing — 281 East Ruimveldt',
  false,
  ARRAY['Electrical repair', 'AC installation', 'AC repair', 'AC servicing']
) ON CONFLICT DO NOTHING;

-- M Tech Electrical — East Coast Demerara
-- Source: VyMaps
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'M Tech Electrical',
  NULL,
  ARRAY['electrician'],
  ARRAY['ecd-plaisance'],
  'Electrical services. Located at 334 Section D, Non Pariel, East Coast Demerara.',
  'web_scrape',
  'VyMaps listing — Non Pariel, ECD',
  false,
  ARRAY['Electrical installation', 'Electrical repair']
) ON CONFLICT DO NOTHING;

-- L. Kanhai''s Electrical, Hardware & Contracting Services — Kitty
-- Source: VyMaps
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'L. Kanhai''s Electrical, Hardware & Contracting',
  NULL,
  ARRAY['electrician'],
  ARRAY['gt-kitty'],
  'Electrical, hardware, and contracting services. Lot 14 Public Road Kitty, Georgetown.',
  'web_scrape',
  'VyMaps listing — Lot 14 Public Road Kitty',
  false,
  ARRAY['Electrical installation', 'Hardware supply', 'General contracting']
) ON CONFLICT DO NOTHING;

-- John''s Electrical Contracting — East Coast Demerara
-- Source: VyMaps
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'John''s Electrical Contracting',
  NULL,
  ARRAY['electrician'],
  ARRAY['ecd-plaisance'],
  'Electrical contracting services. Located at Melanie Damishana, East Coast Demerara.',
  'web_scrape',
  'VyMaps listing — Melanie Damishana, ECD',
  false,
  ARRAY['Electrical contracting', 'Wiring', 'Installation']
) ON CONFLICT DO NOTHING;

-- Winno''s Electrical & Plumbing — West Ruimveldt
-- Source: GCCI
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Winno''s Electrical & Plumbing',
  '6617777',
  ARRAY['electrician', 'plumber'],
  ARRAY['gt-north-ruimveldt', 'gt-south-ruimveldt'],
  'Electrical and plumbing services. 297 West Ruimveldt, Georgetown. Listed with the Georgetown Chamber of Commerce & Industry.',
  'gcci',
  'GCCI member directory — 297 West Ruimveldt',
  false,
  ARRAY['Electrical installation', 'Plumbing', 'Pipe repair']
) ON CONFLICT DO NOTHING;

-- SB Plumbing, Welding and General Construction — South Sophia
-- Source: GCCI
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'SB Plumbing, Welding & General Construction',
  '6466308',
  ARRAY['plumber', 'welder'],
  ARRAY['gt-sophia'],
  'Plumbing, welding, and general construction. 237 Field 8 South Sophia, Georgetown. GCCI member. Also reachable at 616-3884.',
  'gcci',
  'GCCI member — 237 Field 8 South Sophia — also (592) 616-3884',
  false,
  ARRAY['Plumbing', 'Welding', 'General construction', 'Pipe fitting', 'Metal fabrication']
) ON CONFLICT DO NOTHING;

-- MBW Energy Support Services — Plumbing — South Cummingsburg
-- Source: Web search
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'MBW Energy Support Services',
  NULL,
  ARRAY['plumber'],
  ARRAY['gt-campbellville'],
  'Professional plumbing services. 91 Middle St, South Cummingsburg, Georgetown. Also provides energy support services.',
  'web_scrape',
  'mbwenergysupportservices.com — 91 Middle St, South Cummingsburg',
  false,
  ARRAY['Plumbing', 'Pipe installation', 'Maintenance']
) ON CONFLICT DO NOTHING;

-- Ramchand Auto Electrical Repair — East Coast Demerara
-- Source: WorldPlaces / Google Maps
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Ramchand Auto Electrical Repair',
  '6464918',
  ARRAY['mechanic', 'electrician'],
  ARRAY['ecd-plaisance', 'ecd-bv'],
  'Auto electrical repair and spare parts. 212 Bladen Hall School Road, 4th St, ECD. Open Tue-Sat 8AM-5PM, Sun 8AM-12PM.',
  'google_maps',
  'WorldPlaces — 212 Bladen Hall School Road, ECD',
  false,
  ARRAY['Auto electrical', 'Car repair', 'Spare parts']
) ON CONFLICT DO NOTHING;

-- Samaroo''s Welding & Fabrication — East Coast Demerara
-- Source: WorldPlaces (listed near Ramchand)
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Samaroo''s Welding & Fabrication',
  NULL,
  ARRAY['welder'],
  ARRAY['ecd-plaisance', 'ecd-bv'],
  'Welding and fabrication services. Located near Bladen Hall, East Coast Demerara.',
  'web_scrape',
  'WorldPlaces listing — near Bladen Hall, ECD',
  false,
  ARRAY['Welding', 'Metal fabrication', 'Gates', 'Grills']
) ON CONFLICT DO NOTHING;

-- False Ceiling & More — Kitty
-- Source: Expat.com
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'False Ceiling & More',
  '6544970',
  ARRAY['carpenter'],
  ARRAY['gt-kitty'],
  'False ceiling installation and interior decoration services. Georgetown, Kitty area. Recommended on Expat.com.',
  'web_scrape',
  'Expat.com listing — Georgetown, Kitty',
  false,
  ARRAY['False ceiling', 'Interior decoration', 'Carpentry']
) ON CONFLICT DO NOTHING;

-- Shaheed Establishment Home Improvement — East Coast Demerara
-- Source: WorldPlaces (listed near Ramchand)
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Shaheed Establishment Home Improvement',
  NULL,
  ARRAY['carpenter', 'painter'],
  ARRAY['ecd-plaisance', 'ecd-bv'],
  'Home improvement services near Bladen Hall, East Coast Demerara.',
  'web_scrape',
  'WorldPlaces listing — near Bladen Hall, ECD',
  false,
  ARRAY['Home improvement', 'Renovation', 'Painting', 'Carpentry']
) ON CONFLICT DO NOTHING;

-- Qualitest Offshore Inc — Welding Inspection (commercial, but useful reference)
-- Source: qualitest.gy
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Qualitest Offshore Inc.',
  '7516883',
  ARRAY['welder'],
  ARRAY['gt-kitty', 'gt-campbellville'],
  'Certified welding inspection and engineering services. AWS, DNV, ABS certified. Offshore and onshore welding, fabrication inspection. Georgetown-based with nationwide service.',
  'web_scrape',
  'qualitest.gy — Georgetown, Guyana',
  false,
  ARRAY['Welding inspection', 'Fabrication', 'NDT testing', 'Weld certification']
) ON CONFLICT DO NOTHING;

-- ============================================
-- NEW FINDS from FindYello.com, GuyanaIndex.com, WhoDoYou.com
-- ============================================

-- Elias Plumbing — Georgetown (Verified on GuyanaIndex)
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Elias Plumbing',
  '6212992',
  ARRAY['plumber'],
  ARRAY['gt-kitty', 'gt-campbellville'],
  'Verified plumbing business in Georgetown. Listed on GuyanaIndex with website.',
  'web_scrape',
  'GuyanaIndex.com (verified listing)',
  false,
  ARRAY['Plumbing', 'Pipe repair', 'Installation']
) ON CONFLICT DO NOTHING;

-- Plumbing Syndicate — Annandale, ECD
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Plumbing Syndicate',
  '6944586',
  ARRAY['plumber'],
  ARRAY['ecd-plaisance', 'ecd-bv'],
  'Plumbing services. Lot #8 Annandale Public Rd, East Coast Demerara.',
  'web_scrape',
  'GuyanaIndex.com — Lot 8 Annandale Public Rd',
  false,
  ARRAY['Plumbing', 'Pipe repair']
) ON CONFLICT DO NOTHING;

-- Antnat Plumbing Supplies & Hardware — Middle Street, Georgetown
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Antnat Plumbing Supplies & Hardware',
  '2250581',
  ARRAY['plumber'],
  ARRAY['gt-campbellville', 'gt-lacytown'],
  'Plumbing supplies and hardware. 315 Middle Street, Georgetown.',
  'web_scrape',
  'GuyanaIndex.com — 315 Middle Street, Georgetown',
  false,
  ARRAY['Plumbing supplies', 'Hardware', 'Plumbing installation']
) ON CONFLICT DO NOTHING;

-- FindYello Electrical Contractor — LP#2 Dry River Trace
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Electrical Contractor (Dry River Trace)',
  '6217859',
  ARRAY['electrician'],
  ARRAY['gt-kitty'],
  'Electrical contractor. LP#2 Dry River Trace. Listed on FindYello.',
  'web_scrape',
  'FindYello.com — LP#2 Dry River Trace',
  false,
  ARRAY['Electrical contracting', 'Wiring', 'Installation']
) ON CONFLICT DO NOTHING;

-- FindYello Electrical Contractor — 83 Garnett St, Campbellville
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Electrical Contractor (Garnett St)',
  '2256158',
  ARRAY['electrician'],
  ARRAY['gt-campbellville'],
  'Electrical contractor. 83 Garnett Street, Campbellville, Georgetown. Listed on FindYello.',
  'web_scrape',
  'FindYello.com — 83 Garnett St C/ville',
  false,
  ARRAY['Electrical contracting', 'Wiring']
) ON CONFLICT DO NOTHING;

-- FindYello Electrical Contractor — 422A McDavid St, Republic Park EBD
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Electrical Contractor (Republic Park)',
  '6711598',
  ARRAY['electrician'],
  ARRAY['ebd-providence', 'ebd-eccles'],
  'Electrical contractor. 422A McDavid Street, Republic Park, East Bank Demerara. Listed on FindYello.',
  'web_scrape',
  'FindYello.com — 422A McDavid St, Republic Park EBD',
  false,
  ARRAY['Electrical contracting', 'Wiring', 'Installation']
) ON CONFLICT DO NOTHING;

-- Cummings Electrical Co. Ltd — Section L, Demerara-Mahaica
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Cummings Electrical Co. Ltd',
  NULL,
  ARRAY['electrician'],
  ARRAY['gt-kitty', 'gt-campbellville'],
  'Established electrical company. 308 Section L, Demerara-Mahaica. Listed on FindYello.',
  'web_scrape',
  'FindYello.com — 308 Section L',
  false,
  ARRAY['Electrical supply', 'Electrical contracting']
) ON CONFLICT DO NOTHING;

-- Kanhai''s Guyana Electrical Agency — Founded 1970
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Kanhai''s Guyana Electrical Agency',
  NULL,
  ARRAY['electrician'],
  ARRAY['gt-kitty'],
  'Founded in 1970 by Kamal Kanhai. Synonymous with reliability and quality in electrical services. One of Guyana''s longest-running electrical businesses.',
  'web_scrape',
  'FindYello.com description',
  false,
  ARRAY['Electrical supply', 'Electrical installation', 'Electrical contracting']
) ON CONFLICT DO NOTHING;

-- Eastbank Electrical and Industrial Supplies Inc — Diamond, EBD
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Eastbank Electrical & Industrial Supplies',
  '5044021',
  ARRAY['electrician'],
  ARRAY['ebd-diamond'],
  'Leading provider of high-quality electrical and industrial supplies. 17 Public Road, Diamond, East Bank Demerara.',
  'web_scrape',
  'FindYello.com — 17 Public Road, Diamond EBD',
  false,
  ARRAY['Electrical supplies', 'Industrial supplies', 'Electrical equipment']
) ON CONFLICT DO NOTHING;

-- Prem''s Electrical Store — 25+ years
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Prem''s Electrical Store',
  NULL,
  ARRAY['electrician'],
  ARRAY['gt-kitty', 'gt-campbellville'],
  'For over 25 years, a proud distributor of residential, industrial, and commercial electrical supplies throughout Guyana.',
  'web_scrape',
  'FindYello.com description',
  false,
  ARRAY['Electrical supplies', 'Residential electrical', 'Commercial electrical']
) ON CONFLICT DO NOTHING;

-- WM Services — AC Company
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'WM Services',
  NULL,
  ARRAY['ac-technician'],
  ARRAY['gt-kitty', 'gt-campbellville'],
  'Air conditioning company with years of experience providing exceptional service to commercial, industrial and residential customers throughout Guyana.',
  'web_scrape',
  'FindYello.com description',
  false,
  ARRAY['AC installation', 'AC repair', 'AC servicing', 'Commercial AC']
) ON CONFLICT DO NOTHING;

-- Service Guyana — Premier AC/Ducting
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Service Guyana',
  NULL,
  ARRAY['ac-technician'],
  ARRAY['gt-kitty', 'gt-campbellville'],
  'Guyana''s premier solution provider for air conditioning, ducting, building controls and indoor air quality for both onshore and offshore.',
  'web_scrape',
  'FindYello.com description',
  false,
  ARRAY['AC installation', 'Ducting', 'Building controls', 'Indoor air quality']
) ON CONFLICT DO NOTHING;

-- FindYello Plumber — 164 Marshall St, Annandale ECD
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Plumber (Marshall St Annandale)',
  '6237241',
  ARRAY['plumber'],
  ARRAY['ecd-plaisance', 'ecd-bv'],
  'Plumbing services. 164 Marshall Street, Annandale, East Coast Demerara.',
  'web_scrape',
  'FindYello.com — 164 Marshall St Annandale ECD',
  false,
  ARRAY['Plumbing']
) ON CONFLICT DO NOTHING;

-- FindYello Plumber — 1150 Bare Root, ECD
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Plumber (Bare Root ECD)',
  '6566794',
  ARRAY['plumber'],
  ARRAY['ecd-plaisance'],
  'Plumbing services. 1150 Bare Root, East Coast Demerara.',
  'web_scrape',
  'FindYello.com — 1150 Bare Root ECD',
  false,
  ARRAY['Plumbing']
) ON CONFLICT DO NOTHING;

-- WhoDoYou plumber referral — Stanley, phone 623-0776
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Stanley (Nishal''s referral)',
  '6230776',
  ARRAY['plumber'],
  ARRAY['gt-kitty'],
  'Plumber recommended on WhoDoYou by Nishal: "he know his work..he works with me at the hospital."',
  'web_scrape',
  'WhoDoYou.com — community recommendation',
  false,
  ARRAY['Plumbing']
) ON CONFLICT DO NOTHING;

-- FindYello General Contractor — 65 David St, Subryanville
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'General Contractor (David St)',
  '6505930',
  ARRAY['mason', 'carpenter'],
  ARRAY['gt-subryanville'],
  'General contractor. 65 David Street, Subryanville, Georgetown.',
  'web_scrape',
  'FindYello.com — 65 David St Subryanville',
  false,
  ARRAY['General contracting', 'Construction', 'Renovation']
) ON CONFLICT DO NOTHING;

-- FindYello General Contractor — 83 Old Rd, Eccles EBD
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'General Contractor (Eccles)',
  '2332635',
  ARRAY['mason', 'carpenter'],
  ARRAY['ebd-eccles'],
  'General contractor with 5-star review. 83 Old Road, Eccles, East Bank Demerara. Has website.',
  'web_scrape',
  'FindYello.com — 83 Old Rd Eccles EBD (5.0 rating, 1 review)',
  false,
  ARRAY['General contracting', 'Construction']
) ON CONFLICT DO NOTHING;

-- FindYello General Contractor — 225 New Market St, North C/burg
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'General Contractor (New Market St)',
  '2265165',
  ARRAY['mason', 'carpenter'],
  ARRAY['gt-campbellville'],
  'General contractor. 225 New Market Street, North Cummingsburg, Georgetown.',
  'web_scrape',
  'FindYello.com — 225 New Market St N C/burg',
  false,
  ARRAY['General contracting', 'Construction']
) ON CONFLICT DO NOTHING;

-- FindYello General Contractor — Foulis ECD
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'General Contractor (Foulis)',
  '2550049',
  ARRAY['mason', 'carpenter'],
  ARRAY['ecd-plaisance'],
  'General contractor. 678 17th Street, Foulis, East Coast Demerara.',
  'web_scrape',
  'FindYello.com — 678 17th St Foulis ECD',
  false,
  ARRAY['General contracting', 'Construction']
) ON CONFLICT DO NOTHING;

-- Floor It — Hardwood Floors
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Floor It',
  NULL,
  ARRAY['carpenter'],
  ARRAY['gt-kitty', 'gt-campbellville'],
  'Home improvement company dedicated to supplying, installing, sanding, and finishing hardwood floors.',
  'web_scrape',
  'FindYello.com description',
  false,
  ARRAY['Hardwood flooring', 'Floor installation', 'Floor sanding', 'Floor finishing']
) ON CONFLICT DO NOTHING;

-- Pantheon Construction Inc — Bel Air Village ECD
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Pantheon Construction Inc.',
  NULL,
  ARRAY['mason', 'carpenter'],
  ARRAY['ecd-plaisance', 'ecd-bv'],
  'Incorporated October 2019 at Lot 13 Bel Air Village, East Coast Demerara. Operations began September 2020.',
  'web_scrape',
  'FindYello.com — Lot 13 Bel Air Village ECD',
  false,
  ARRAY['Construction', 'Building', 'Renovation']
) ON CONFLICT DO NOTHING;

-- FindYello Contractor — 344 Sachi Bazaar, Prashad Nagar
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'General Contractor (Prashad Nagar)',
  '5031684',
  ARRAY['mason', 'carpenter'],
  ARRAY['gt-subryanville', 'gt-bel-air'],
  'General contractor. 344 Sachi Bazaar, Prashad Nagar.',
  'web_scrape',
  'FindYello.com — 344 Sachi Bazaar, Prashad Nagar',
  false,
  ARRAY['General contracting', 'Construction']
) ON CONFLICT DO NOTHING;

-- Trans Pacific Motor — Multiple locations, auto repair
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Trans Pacific Motor',
  '6436441',
  ARRAY['mechanic'],
  ARRAY['gt-w-ruimveldt', 'ecd-plaisance'],
  'Reliable auto maintenance and repair facility servicing a wide range of automotive needs. Imports, domestics, and high-performance exotic cars. Lot #19 Cactus Road, West Ruimveldt. Also at Lot 6 Good Hope ECD and Lot 43 Robb & Light St Bourda.',
  'web_scrape',
  'FindYello.com — multiple locations (W Ruimveldt, Good Hope ECD, Bourda)',
  false,
  ARRAY['Auto repair', 'AC service', 'Brake repair', 'Computer diagnostics', 'Wheel alignment', 'Suspension']
) ON CONFLICT DO NOTHING;

-- AAA Automotive Repair And Spare Parts — Railway Embankment, Georgetown
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'AAA Automotive Repair & Spare Parts',
  '5020772',
  ARRAY['mechanic'],
  ARRAY['gt-kitty', 'gt-lacytown'],
  'Auto repair and spare parts. 29b Railway Embankment, Georgetown.',
  'web_scrape',
  'FindYello.com — 29b Railway Embankment, Georgetown',
  false,
  ARRAY['Auto repair', 'Spare parts', 'Auto parts']
) ON CONFLICT DO NOTHING;

-- Performance Plus Service Centre — Auto Repairs
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Performance Plus Service Centre',
  NULL,
  ARRAY['mechanic'],
  ARRAY['gt-kitty'],
  'Auto repair service centre. Listed on FindYello as James Service Centre / Performance Plus.',
  'web_scrape',
  'FindYello.com profile',
  false,
  ARRAY['Auto repair', 'Vehicle servicing']
) ON CONFLICT DO NOTHING;

-- TOSL Engineering Limited — Electrical Contractor (Trinidad-based, operates in Guyana)
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'TOSL Engineering Limited',
  NULL,
  ARRAY['electrician'],
  ARRAY['gt-kitty', 'gt-campbellville'],
  'Trinidad-born and locally operated Engineering Services company supporting many industries within the Caribbean region for over 40 years.',
  'web_scrape',
  'FindYello.com — Electrical Contractors category',
  false,
  ARRAY['Electrical engineering', 'Industrial electrical', 'Electrical contracting']
) ON CONFLICT DO NOTHING;

-- Westzyde Marine Inc — La Grange, WBD (welding/marine)
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Westzyde Marine Inc',
  '6200269',
  ARRAY['welder', 'mechanic'],
  ARRAY['wbd-vreedenhoop'],
  'Marine equipment service and repair. Lot 15 Section F, La Grange, West Bank Demerara.',
  'web_scrape',
  'FindYello.com — Lot 15 Section F, La Grange WBD',
  false,
  ARRAY['Marine repair', 'Marine equipment', 'Welding', 'Fabrication']
) ON CONFLICT DO NOTHING;

-- Silvie''s Industrial Solutions — Auto/hardware/electrical
INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, is_claimed, services_offered)
VALUES (
  'Silvie''s Industrial Solutions',
  NULL,
  ARRAY['mechanic', 'electrician'],
  ARRAY['gt-kitty'],
  'Well-known supplier of automobile and motorcycle parts. Diversified into hardware, electrical, industrial products and farming equipment.',
  'web_scrape',
  'FindYello.com description',
  false,
  ARRAY['Auto parts', 'Motorcycle parts', 'Hardware', 'Electrical supplies', 'Industrial products']
) ON CONFLICT DO NOTHING;

-- ============================================
-- ============================================
-- Facebook Scraped Providers (Session 6)
-- Source: Guyana Contractors & Tradesmen group
-- ============================================

INSERT INTO providers (name, phone, trades, areas, description, source, source_detail) VALUES
('Rockerz Woodworking', '6551868', ARRAY['carpenter'], ARRAY['gt-georgetown'], 'Custom doors in all sizes. Purple heart & Kabukalli hardwood. Also available at 695-0987.', 'facebook', 'Guyana Contractors & Tradesmen - Facebook'),
('Kenrick Jeeboo', '6296901', ARRAY['welder'], ARRAY['gt-georgetown'], 'CNC fences, gates, rails. Decorative metalwork and custom designs.', 'facebook', 'Guyana Contractors & Tradesmen - Facebook');

-- GRAND TOTAL: 45 real providers scraped
-- Sources: VyMaps, Expat.com, GCCI, WorldPlaces, GuyanaIndex.com, FindYello.com, WhoDoYou.com, Facebook, business websites
-- With phone: ~27 | Without phone: ~18 (need manual Facebook lookup)
-- Trades: Electrician (14), Plumber (9), Mason/Contractor (7), Carpenter (5), Mechanic (5), Welder (5), AC Tech (3), Painter (1)
-- Areas: Georgetown (Kitty, Campbellville, Ruimveldt, Sophia, LePenitence, Subryanville, Lacytown, Bourda),
--         ECD (Plaisance, BV, Non Pariel, Annandale, Foulis, Bel Air Village),
--         EBD (Diamond, Eccles, Republic Park, Providence),
--         WBD (La Grange)
-- ============================================
