-- ============================================================================
-- DB SCHEMA FOR LDREAS LABORATORY WEBSITE (POSTGRESQL / SUPABASE)
-- ============================================================================
-- This schema matches the required specifications for the public-facing showcase.
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom ENUM types
CREATE TYPE member_role AS ENUM ('member', 'team_leader', 'lab_leader');
CREATE TYPE project_state AS ENUM ('planned', 'ongoing', 'completed');

-- ----------------------------------------------------------------------------
-- singleton: Contains LDREAS laboratory institutional details
-- ----------------------------------------------------------------------------
CREATE TABLE research_lab (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    logo_url TEXT,
    director TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    fax TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ----------------------------------------------------------------------------
-- Research teams within the laboratory
-- ----------------------------------------------------------------------------
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    acronym TEXT NOT NULL,
    description TEXT NOT NULL,
    team_leader_id UUID, -- Foreign Key will be added as a separate constraint because of circular references
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ----------------------------------------------------------------------------
-- Laboratory members and scientists profiles
-- ----------------------------------------------------------------------------
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role member_role DEFAULT 'member'::member_role NOT NULL,
    grade TEXT NOT NULL,
    degree TEXT NOT NULL,
    specialty TEXT NOT NULL,
    photo_url TEXT,
    bio TEXT,
    joined_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add circular foreign key to teams table referencing members(id)
ALTER TABLE teams ADD CONSTRAINT fk_team_leader FOREIGN KEY (team_leader_id) REFERENCES members(id) ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- Scientific projects undertaken by research teams
-- ----------------------------------------------------------------------------
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    started_at DATE NOT NULL,
    expected_end_date DATE NOT NULL,
    state project_state DEFAULT 'planned'::project_state NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT date_range_check CHECK (expected_end_date >= started_at)
);

-- ----------------------------------------------------------------------------
-- Lab news and announcements
-- ----------------------------------------------------------------------------
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT,
    published_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    author_id UUID REFERENCES members(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ----------------------------------------------------------------------------
-- Scientific publications and articles
-- ----------------------------------------------------------------------------
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    journal_link TEXT,
    pdf_link TEXT,
    description TEXT,
    published_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    primary_author_id UUID REFERENCES members(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ----------------------------------------------------------------------------
-- Junction table linking publications to other lab members as co-authors
-- ----------------------------------------------------------------------------
CREATE TABLE article_co_authors (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    PRIMARY KEY (article_id, member_id)
);


-- ----------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE AND UNIQUE LOOKUPS
-- ----------------------------------------------------------------------------
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_team ON members(team_id);
CREATE INDEX idx_teams_leader ON teams(team_leader_id);
CREATE INDEX idx_projects_team ON projects(team_id);
CREATE INDEX idx_news_author ON news(author_id);
CREATE INDEX idx_articles_author ON articles(primary_author_id);
CREATE INDEX idx_coauthors_member ON article_co_authors(member_id);
