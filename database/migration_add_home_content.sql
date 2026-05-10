ALTER TABLE settings
ADD COLUMN hero_badge VARCHAR(255) NOT NULL DEFAULT 'ROWAIDA ART EXPERIENCE',
ADD COLUMN hero_title_line_1 VARCHAR(255) NOT NULL DEFAULT 'مساحة فنية راقية',
ADD COLUMN hero_title_line_2 VARCHAR(255) NOT NULL DEFAULT 'تجمع السينما والفعاليات',
ADD COLUMN hero_title_line_3 VARCHAR(255) NOT NULL DEFAULT 'بطابع مختلف تمامًا',
ADD COLUMN hero_description TEXT NOT NULL DEFAULT 'رويدة آرت ليست مجرد موقع عروض، بل واجهة أنيقة لتجربة متكاملة تضم أفلامًا مختارة، ورشًا إبداعية، وفعاليات بهوية بصرية هادئة وفاخرة.';
