set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"username" varchar(255) NOT NULL,
	"hashedPassword" varchar(255) NOT NULL,
	"createdAt" TIMESTAMP NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."albumReviews" (
	"reviewId" serial NOT NULL,
	"userId" integer NOT NULL,
	"albumId" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL,
	"updatedAt" TIMESTAMP NOT NULL,
	CONSTRAINT "albumReviews_pk" PRIMARY KEY ("reviewId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."bookmarks" (
	"bookmarkId" serial NOT NULL,
	"userId" integer NOT NULL,
	"albumId" integer NOT NULL,
	"createdAt" TIMESTAMP NOT NULL,
	CONSTRAINT "bookmarks_pk" PRIMARY KEY ("bookmarkId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."albums" (
	"albumId" serial NOT NULL,
	"albumImg" varchar(255) NOT NULL,
	"albumName" varchar(255) NOT NULL,
	"artist" varchar(255) NOT NULL,
	"createdAt" TIMESTAMP NOT NULL,
	CONSTRAINT "albums_pk" PRIMARY KEY ("albumId")
) WITH (
	OIDS=FALSE
);




ALTER TABLE "albumReviews" ADD CONSTRAINT "albumReviews_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "albumReviews" ADD CONSTRAINT "albumReviews_fk1" FOREIGN KEY ("albumId") REFERENCES "albums"("albumId");

ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_fk1" FOREIGN KEY ("albumId") REFERENCES "albums"("albumId");
