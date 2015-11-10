
-- Create the database

CREATE DATABASE "pyGreedy"
  WITH OWNER = "pyGreedy"
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'C'
       LC_CTYPE = 'C'
       CONNECTION LIMIT = -1;

-- End of create database

-- Account table definition

CREATE TABLE public."account"
(
  accid text NOT NULL,
  name text NOT NULL,
  sapid text NOT NULL,
  identifier text NOT NULL,
  ratesheet text NOT NULL,
  discount text NOT NULL,
  parent_company text NOT NULL,
  vat numeric NOT NULL,
  address1 text NOT NULL,
  address2 text NOT NULL,
  address3 text NOT NULL,
  address4 text NOT NULL,
  address5 text NOT NULL,
  CONSTRAINT "Account_pkey" PRIMARY KEY (accid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."account"
  OWNER TO "pyGreedy";

-- End od account table definition

-- Extracharged definition

CREATE SEQUENCE public.extracharges_extrachargeid_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE public.extracharges_extrachargeid_seq
  OWNER TO "pyGreedy";

CREATE TABLE public."extracharges"
(
  extrachargeid integer NOT NULL DEFAULT nextval('"extracharges_extrachargeid_seq"'::regclass),
  description text NOT NULL,
  details text NOT NULL,
  code text NOT NULL,
  qty integer NOT NULL,
  charge double precision NOT NULL,
  recurring boolean NOT NULL,
  period date NOT NULL,
  accid text NOT NULL,
  CONSTRAINT "Extracharges_pkey" PRIMARY KEY (extrachargeid),
  CONSTRAINT "Extracharges_accid_fkey" FOREIGN KEY (accid)
      REFERENCES public."account" (accid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."extracharges"
  OWNER TO "pyGreedy";

-- End of extracharges table definition

-- Numbers table definition

CREATE TABLE public."numbers"
(
 number text NOT NULL,
 accid text NOT NULL,
 CONSTRAINT "Numbers_pkey" PRIMARY KEY (number),
 CONSTRAINT "Numbers_accid_fkey" FOREIGN KEY (accid)
      REFERENCES public."account" (accid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."numbers"
  OWNER TO "pyGreedy";

-- End of numbers table definition

-- Region table definition

CREATE TABLE public."region"
(
 regionid integer NOT NULL,
 name text NOT NULL,
 CONSTRAINT "Region_pkey" PRIMARY KEY (regionid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."region"
  OWNER TO "pyGreedy";

-- End of region table definition

-- Zone table definition

CREATE TABLE public."zone"
(
 zoneid integer NOT NULL,
 name text NOT NULL,
 regionid integer NOT NULL,
 CONSTRAINT "Zone_pkey" PRIMARY KEY (zoneid),
 CONSTRAINT "Zone_regionid_fkey" FOREIGN KEY (regionid)
            REFERENCES public."region" (regionid) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE SET NULL
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."zone"
  OWNER TO "pyGreedy";

-- End of zone table definition

-- ratesheet table definition

CREATE SEQUENCE public.ratesheet_ratesheetid_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE public.ratesheet_ratesheetid_seq
  OWNER TO "pyGreedy";

CREATE TABLE public."ratesheet"
(
 ratesheetid integer NOT NULL DEFAULT nextval('"ratesheet_ratesheetid_seq"'::regclass),
 name text NOT NULL,
 type character NOT NULL,
 CONSTRAINT "Ratesheet_pkey" PRIMARY KEY (ratesheetid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."ratesheet"
  OWNER TO "pyGreedy";

ALTER TABLE public.ratesheet
  ADD CONSTRAINT ratesheet_name_unique UNIQUE(name);

-- End of ratesheet table definition

-- rate table definition

CREATE SEQUENCE public.rate_rateid_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE public.rate_rateid_seq
  OWNER TO "pyGreedy";

CREATE TABLE public."rate"
(
 rateid integer NOT NULL DEFAULT nextval('"rate_rateid_seq"'::regclass),
 cc text NOT NULL,
 number text NOT NULL,
 flat_rate numeric NOT NULL,
 peak numeric NOT NULL,
 offpeak numeric NOT NULL,
 weekend numeric NOT NULL,
 ratetype character NOT NULL,
 zoneid integer NOT NULL,
 ratesheetid integer NOT NULL,
 CONSTRAINT "Rate_pkey" PRIMARY KEY (rateid),
 CONSTRAINT "Rate_zoneid_fkey" FOREIGN KEY (zoneid)
            REFERENCES public."zone" (zoneid) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE SET NULL,
 CONSTRAINT "Rate_ratesheetid_fkey" FOREIGN KEY (ratesheetid)
            REFERENCES public."ratesheet" (ratesheetid) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."rate"
  OWNER TO "pyGreedy";

CREATE INDEX rate_name_idx
  ON public.rate
  USING btree
  (number text_pattern_ops);

CREATE INDEX rate_ratesheetid_idx
  ON public.rate
  USING btree
  (ratesheetid);
-- End of rate table definition

-- Mediatedcall table definition

CREATE SEQUENCE public.mediatedcall_medcallid_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE public.mediatedcall_medcallid_seq
  OWNER TO "pyGreedy";

CREATE TABLE public."mediatedcall"
(
 medcallid integer NOT NULL DEFAULT nextval('"mediatedcall_medcallid_seq"'::regclass),
 accid text NOT NULL,
 call_date date NOT NULL,
 call_time time without time zone NOT NULL,
 length integer NOT NULL,
 calling_number text NOT NULL,
 direction character NOT NULL,
 called_number text NOT NULL,
 ratetype character NOT NULL,
 valid boolean NOT NULL,
 note text,
 CONSTRAINT "Mediatedcall_pkey" PRIMARY KEY (medcallid),
 CONSTRAINT "Mediatedcall_accid_fkey" FOREIGN KEY (accid)
            REFERENCES public."account" (accid) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."rate"
  OWNER TO "pyGreedy";

CREATE INDEX medcall_calling_num_idx
  ON public.mediatedcall
  USING btree
  (calling_number text_pattern_ops);

CREATE INDEX medcall_called_num_idx
  ON public.mediatedcall
  USING btree
  (called_number text_pattern_ops);

-- End of mediatedcall table definition

-- Ratedcall table definition

CREATE SEQUENCE public.ratedcall_ratedcallid_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE public.ratedcall_ratedcallid_seq
  OWNER TO "pyGreedy";

CREATE TABLE public."ratedcall"
(
 ratedcallid integer NOT NULL DEFAULT nextval('"ratedcall_ratedcallid_seq"'::regclass),
 accid text NOT NULL,
 call_date date NOT NULL,
 call_time time without time zone NOT NULL,
 calling_number text NOT NULL,
 called_number text NOT NULL,
 zoneid integer NOT NULL,
 regionid integer NOT NULL,
 length integer NOT NULL,
 charge numeric NOT NULL,
 CONSTRAINT "Ratedcall_pkey" PRIMARY KEY (ratedcallid),
 CONSTRAINT "Ratedcall_accid_fkey" FOREIGN KEY (accid)
            REFERENCES public."account" (accid) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."rate"
  OWNER TO "pyGreedy";

CREATE INDEX ratedcall_calling_num_idx
  ON public.ratedcall
  USING btree
  (calling_number text_pattern_ops);

CREATE INDEX ratedcall_called_num_idx
  ON public.ratedcall
  USING btree
  (called_number text_pattern_ops);

-- End of mediatedcall table definition
