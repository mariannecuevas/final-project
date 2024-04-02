SET client_min_messages TO warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
DROP SCHEMA "public" CASCADE;

CREATE SCHEMA "public";

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"username" varchar(255) NOT NULL,
	"hashedPassword" varchar(255) NOT NULL,
	"createdAt" date DEFAULT ('now'::text)::date NOT NULL,
	"updatedAt" timestamptz(6) DEFAULT now() NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."albumReviews" (
	"reviewId" serial NOT NULL,
	"userId" integer NOT NULL,
	"albumName" varchar(255) NOT NULL,
	"artist" varchar(255) NOT NULL,
  "albumImg" varchar(255) NOT NULL,
	"rating" integer NOT NULL,
	"comment" TEXT NOT NULL,
	"createdAt" date DEFAULT ('now'::text)::date NOT NULL,
	"updatedAt" timestamptz(6) DEFAULT now() NOT NULL,
	CONSTRAINT "albumReviews_pk" PRIMARY KEY ("reviewId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."bookmarks" (
	"bookmarkId" serial NOT NULL,
	"userId" integer NOT NULL,
	"albumName" varchar(255) NOT NULL,
	"artist" varchar(255) NOT NULL,
  "albumImg" varchar(255) NOT NULL,
	"createdAt" date DEFAULT ('now'::text)::date NOT NULL,
	CONSTRAINT "bookmarks_pk" PRIMARY KEY ("bookmarkId"),
	CONSTRAINT "bookmarks_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "albumReviews" ADD CONSTRAINT "albumReviews_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
