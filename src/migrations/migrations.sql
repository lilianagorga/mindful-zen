SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;


CREATE TABLE public.goals (
  id integer NOT NULL,
  name character varying NOT NULL,
  "intervalId" integer NOT NULL
);

CREATE SEQUENCE public.goals_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE public.goals_id_seq OWNED BY public.goals.id;

CREATE TABLE public.intervals (
  id integer NOT NULL,
  "startDate" timestamp without time zone NOT NULL,
  "endDate" timestamp without time zone NOT NULL,
  "userId" integer NOT NULL
);

CREATE SEQUENCE public.intervals_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE public.intervals_id_seq OWNED BY public.intervals.id;

CREATE TABLE public.migrations (
  id integer NOT NULL,
  "timestamp" bigint NOT NULL,
  name character varying NOT NULL
);

CREATE SEQUENCE public.migrations_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;

CREATE TABLE public.users (
  id integer NOT NULL,
  email character varying NOT NULL,
  "firstName" character varying,
  "lastName" character varying,
  password character varying NOT NULL,
  role character varying DEFAULT 'user'::character varying NOT NULL
);

CREATE SEQUENCE public.users_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

ALTER TABLE ONLY public.goals ALTER COLUMN id SET DEFAULT nextval('public.goals_id_seq'::regclass);

ALTER TABLE ONLY public.intervals ALTER COLUMN id SET DEFAULT nextval('public.intervals_id_seq'::regclass);

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

ALTER TABLE ONLY public.goals
  ADD CONSTRAINT "PK_26e17b251afab35580dff769223" PRIMARY KEY (id);

ALTER TABLE ONLY public.intervals
  ADD CONSTRAINT "PK_7e4b9f86ec6cdbdbf21c19f79b5" PRIMARY KEY (id);

ALTER TABLE ONLY public.migrations
  ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);

ALTER TABLE ONLY public.users
  ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);

ALTER TABLE ONLY public.users
  ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);

ALTER TABLE ONLY public.intervals
  ADD CONSTRAINT "FK_0684b09d6f96e9368f4336b3d76" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.goals
  ADD CONSTRAINT "FK_63af97c5d924d968d82417f894b" FOREIGN KEY ("intervalId") REFERENCES public.intervals(id) ON DELETE CASCADE;