--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.1 (Ubuntu 12.1-1.pgdg19.04+1)

--
-- TOC entry 253 (class 1259 OID 196649)
-- Name: assets; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.assets (
    id integer NOT NULL,
    file_url character varying NOT NULL,
    file_name character varying NOT NULL,
    attachable_type character varying,
    attachable_id integer,
    meta_data jsonb,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.assets OWNER TO autobook;

--
-- TOC entry 252 (class 1259 OID 196647)
-- Name: assets_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.assets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assets_id_seq OWNER TO autobook;

--
-- TOC entry 3267 (class 0 OID 0)
-- Dependencies: 252
-- Name: assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.assets_id_seq OWNED BY public.assets.id;


--
-- TOC entry 239 (class 1259 OID 139285)
-- Name: carriers; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.carriers (
    id integer NOT NULL,
    mc_number integer,
    dot_number integer,
    company_name character varying NOT NULL,
    address character varying NOT NULL,
    city character varying NOT NULL,
    state character varying NOT NULL,
    zipcode character varying NOT NULL,
    phone_number character varying NOT NULL,
    fax character varying,
    first_contact character varying NOT NULL,
    second_contact character varying,
    insurance_expires character varying,
    email character varying,
    contact_option character varying,
    needs1099 boolean,
    ein character varying,
    ssn character varying,
    custom_field1 character varying,
    custom_field2 character varying,
    custom_field3 character varying,
    custom_field4 character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.carriers OWNER TO autobook;

--
-- TOC entry 238 (class 1259 OID 139283)
-- Name: carriers_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.carriers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.carriers_id_seq OWNER TO autobook;

--
-- TOC entry 3268 (class 0 OID 0)
-- Dependencies: 238
-- Name: carriers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.carriers_id_seq OWNED BY public.carriers.id;


--
-- TOC entry 247 (class 1259 OID 163882)
-- Name: payers; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.payers (
    id integer NOT NULL,
    email character varying NOT NULL,
    anet_profile_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.payers OWNER TO autobook;

--
-- TOC entry 246 (class 1259 OID 163880)
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_id_seq OWNER TO autobook;

--
-- TOC entry 3269 (class 0 OID 0)
-- Dependencies: 246
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.payers.id;


--
-- TOC entry 243 (class 1259 OID 147477)
-- Name: dispatches; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.dispatches (
    id integer NOT NULL,
    order_id integer NOT NULL,
    driver_id integer NOT NULL,
    instructions text,
    pickup_date timestamp without time zone NOT NULL,
    delivery_date timestamp without time zone NOT NULL,
    status character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.dispatches OWNER TO autobook;

--
-- TOC entry 242 (class 1259 OID 147475)
-- Name: dispatches_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.dispatches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dispatches_id_seq OWNER TO autobook;

--
-- TOC entry 3270 (class 0 OID 0)
-- Dependencies: 242
-- Name: dispatches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.dispatches_id_seq OWNED BY public.dispatches.id;


--
-- TOC entry 241 (class 1259 OID 139303)
-- Name: drivers; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.drivers (
    id integer NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying,
    email character varying,
    phone_number character varying NOT NULL,
    carrier_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.drivers OWNER TO autobook;

--
-- TOC entry 240 (class 1259 OID 139301)
-- Name: drivers_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.drivers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.drivers_id_seq OWNER TO autobook;

--
-- TOC entry 3271 (class 0 OID 0)
-- Dependencies: 240
-- Name: drivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.drivers_id_seq OWNED BY public.drivers.id;


--
-- TOC entry 206 (class 1259 OID 41112)
-- Name: email_templates; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.email_templates (
    id integer NOT NULL,
    name character varying NOT NULL,
    template_name character varying NOT NULL,
    email_from character varying NOT NULL,
    email_from_name character varying NOT NULL,
    reply_to character varying NOT NULL,
    email_bcc character varying,
    placeholders character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.email_templates OWNER TO autobook;

--
-- TOC entry 207 (class 1259 OID 41118)
-- Name: email_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.email_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.email_templates_id_seq OWNER TO autobook;

--
-- TOC entry 3272 (class 0 OID 0)
-- Dependencies: 207
-- Name: email_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.email_templates_id_seq OWNED BY public.email_templates.id;


--
-- TOC entry 208 (class 1259 OID 41120)
-- Name: events; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.events (
    id integer NOT NULL,
    target_type character varying NOT NULL,
    target_id integer NOT NULL,
    description character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.events OWNER TO autobook;

--
-- TOC entry 209 (class 1259 OID 41127)
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO autobook;

--
-- TOC entry 3273 (class 0 OID 0)
-- Dependencies: 209
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- TOC entry 210 (class 1259 OID 41129)
-- Name: followup_types; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.followup_types (
    id integer NOT NULL,
    name character varying NOT NULL,
    sms_template_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.followup_types OWNER TO autobook;

--
-- TOC entry 211 (class 1259 OID 41135)
-- Name: followup_types_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.followup_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.followup_types_id_seq OWNER TO autobook;

--
-- TOC entry 3274 (class 0 OID 0)
-- Dependencies: 211
-- Name: followup_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.followup_types_id_seq OWNED BY public.followup_types.id;


--
-- TOC entry 212 (class 1259 OID 41137)
-- Name: followups; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.followups (
    id integer NOT NULL,
    type_id integer NOT NULL,
    notext boolean,
    nofurther boolean,
    note character varying,
    followup_on timestamp without time zone NOT NULL,
    quote_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.followups OWNER TO autobook;

--
-- TOC entry 213 (class 1259 OID 41143)
-- Name: followups_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.followups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.followups_id_seq OWNER TO autobook;

--
-- TOC entry 3275 (class 0 OID 0)
-- Dependencies: 213
-- Name: followups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.followups_id_seq OWNED BY public.followups.id;


--
-- TOC entry 214 (class 1259 OID 41145)
-- Name: mileage_pricings; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.mileage_pricings (
    id integer NOT NULL,
    min_mileage integer NOT NULL,
    max_mileage integer NOT NULL,
    price integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.mileage_pricings OWNER TO autobook;

--
-- TOC entry 215 (class 1259 OID 41148)
-- Name: mileage_pricing_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.mileage_pricing_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mileage_pricing_id_seq OWNER TO autobook;

--
-- TOC entry 3276 (class 0 OID 0)
-- Dependencies: 215
-- Name: mileage_pricing_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.mileage_pricing_id_seq OWNED BY public.mileage_pricings.id;


--
-- TOC entry 237 (class 1259 OID 114725)
-- Name: note_assignments; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.note_assignments (
    id integer NOT NULL,
    note_id integer NOT NULL,
    assignee_id integer NOT NULL,
    viewed boolean DEFAULT false NOT NULL,
    viewed_at timestamp without time zone
);


ALTER TABLE public.note_assignments OWNER TO autobook;

--
-- TOC entry 236 (class 1259 OID 114723)
-- Name: note_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.note_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.note_assignments_id_seq OWNER TO autobook;

--
-- TOC entry 3277 (class 0 OID 0)
-- Dependencies: 236
-- Name: note_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.note_assignments_id_seq OWNED BY public.note_assignments.id;


--
-- TOC entry 255 (class 1259 OID 196661)
-- Name: notes; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.notes (
    id integer NOT NULL,
    note character varying NOT NULL,
    noteable_type character varying,
    noteable_id integer,
    user_id integer NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.notes OWNER TO autobook;

--
-- TOC entry 254 (class 1259 OID 196659)
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notes_id_seq OWNER TO autobook;

--
-- TOC entry 3278 (class 0 OID 0)
-- Dependencies: 254
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- TOC entry 251 (class 1259 OID 163963)
-- Name: order_links; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.order_links (
    id integer NOT NULL,
    encryption character varying NOT NULL,
    order_id integer NOT NULL,
    type character varying NOT NULL,
    expired boolean,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.order_links OWNER TO autobook;

--
-- TOC entry 250 (class 1259 OID 163961)
-- Name: order_links_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.order_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_links_id_seq OWNER TO autobook;

--
-- TOC entry 3279 (class 0 OID 0)
-- Dependencies: 250
-- Name: order_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.order_links_id_seq OWNED BY public.order_links.id;


--
-- TOC entry 249 (class 1259 OID 163908)
-- Name: payer_billing_methods; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.payer_billing_methods (
    id integer NOT NULL,
    payer_id integer NOT NULL,
    anet_payment_profile_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.payer_billing_methods OWNER TO autobook;

--
-- TOC entry 248 (class 1259 OID 163906)
-- Name: payer_billing_methods_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.payer_billing_methods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payer_billing_methods_id_seq OWNER TO autobook;

--
-- TOC entry 3280 (class 0 OID 0)
-- Dependencies: 248
-- Name: payer_billing_methods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.payer_billing_methods_id_seq OWNED BY public.payer_billing_methods.id;


--
-- TOC entry 216 (class 1259 OID 41150)
-- Name: pricing_exceptions; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.pricing_exceptions (
    id integer NOT NULL,
    origin_state character varying NOT NULL,
    origin_city character varying NOT NULL,
    dest_state character varying NOT NULL,
    dest_city character varying NOT NULL,
    origin_radius1 smallint,
    dest_radius1 smallint,
    price1 smallint,
    origin_radius2 smallint,
    dest_radius2 smallint,
    price2 smallint,
    origin_radius3 smallint,
    dest_radius3 smallint,
    price3 smallint,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.pricing_exceptions OWNER TO autobook;

--
-- TOC entry 217 (class 1259 OID 41156)
-- Name: pricing_exception_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.pricing_exception_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pricing_exception_id_seq OWNER TO autobook;

--
-- TOC entry 3281 (class 0 OID 0)
-- Dependencies: 217
-- Name: pricing_exception_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.pricing_exception_id_seq OWNED BY public.pricing_exceptions.id;


--
-- TOC entry 218 (class 1259 OID 41158)
-- Name: quotes; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.quotes (
    id integer NOT NULL,
    shipper jsonb NOT NULL,
    origin jsonb NOT NULL,
    destination jsonb NOT NULL,
    vehicles jsonb NOT NULL,
    transport jsonb NOT NULL,
    parent_status_id integer,
    child_status_id integer,
    payer_id integer,
    payer_billing_method_id integer,
    assignee_id integer,
    is_order boolean,
    terms jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.quotes OWNER TO autobook;

--
-- TOC entry 219 (class 1259 OID 41164)
-- Name: quotes_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.quotes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quotes_id_seq OWNER TO autobook;

--
-- TOC entry 3282 (class 0 OID 0)
-- Dependencies: 219
-- Name: quotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.quotes_id_seq OWNED BY public.quotes.id;


--
-- TOC entry 245 (class 1259 OID 163862)
-- Name: ringcentral_accounts; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.ringcentral_accounts (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    extension character varying NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.ringcentral_accounts OWNER TO autobook;

--
-- TOC entry 244 (class 1259 OID 163860)
-- Name: ringcentral_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.ringcentral_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ringcentral_accounts_id_seq OWNER TO autobook;

--
-- TOC entry 3283 (class 0 OID 0)
-- Dependencies: 244
-- Name: ringcentral_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.ringcentral_accounts_id_seq OWNED BY public.ringcentral_accounts.id;


--
-- TOC entry 235 (class 1259 OID 73772)
-- Name: roles; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying NOT NULL,
    permissions text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.roles OWNER TO autobook;

--
-- TOC entry 234 (class 1259 OID 73770)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO autobook;

--
-- TOC entry 3284 (class 0 OID 0)
-- Dependencies: 234
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 220 (class 1259 OID 41166)
-- Name: sms_templates; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.sms_templates (
    id integer NOT NULL,
    name character varying NOT NULL,
    script text NOT NULL,
    placeholders character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.sms_templates OWNER TO autobook;

--
-- TOC entry 221 (class 1259 OID 41172)
-- Name: sms_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.sms_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sms_templates_id_seq OWNER TO autobook;

--
-- TOC entry 3285 (class 0 OID 0)
-- Dependencies: 221
-- Name: sms_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.sms_templates_id_seq OWNED BY public.sms_templates.id;


--
-- TOC entry 222 (class 1259 OID 41174)
-- Name: statuses; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.statuses (
    id integer NOT NULL,
    type character varying NOT NULL,
    parent_id integer,
    name character varying NOT NULL,
    email_template_id integer,
    sms_template_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.statuses OWNER TO autobook;

--
-- TOC entry 223 (class 1259 OID 41180)
-- Name: statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.statuses_id_seq OWNER TO autobook;

--
-- TOC entry 3286 (class 0 OID 0)
-- Dependencies: 223
-- Name: statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.statuses_id_seq OWNED BY public.statuses.id;


--
-- TOC entry 224 (class 1259 OID 41182)
-- Name: transactions; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    order_id integer NOT NULL,
    amount integer NOT NULL,
    note character varying,
    transaction_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.transactions OWNER TO autobook;

--
-- TOC entry 225 (class 1259 OID 41188)
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_id_seq OWNER TO autobook;

--
-- TOC entry 3287 (class 0 OID 0)
-- Dependencies: 225
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- TOC entry 233 (class 1259 OID 57391)
-- Name: us_cities; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.us_cities (
    id integer NOT NULL,
    city_name character varying(255),
    state_code character varying(255),
    lat real,
    lng real,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.us_cities OWNER TO autobook;

--
-- TOC entry 232 (class 1259 OID 57389)
-- Name: us_cities_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.us_cities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.us_cities_id_seq OWNER TO autobook;

--
-- TOC entry 3288 (class 0 OID 0)
-- Dependencies: 232
-- Name: us_cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.us_cities_id_seq OWNED BY public.us_cities.id;


--
-- TOC entry 226 (class 1259 OID 41190)
-- Name: users; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.users (
    id integer NOT NULL,
    auth0_id character varying NOT NULL,
    email character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    role_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO autobook;

--
-- TOC entry 227 (class 1259 OID 41197)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO autobook;

--
-- TOC entry 3289 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.user_id_seq OWNED BY public.users.id;


--
-- TOC entry 228 (class 1259 OID 41199)
-- Name: vehicle_sizes; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.vehicle_sizes (
    id integer NOT NULL,
    name character varying NOT NULL,
    rate_bump real,
    flat_bump real,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.vehicle_sizes OWNER TO autobook;

--
-- TOC entry 229 (class 1259 OID 41205)
-- Name: vehicle_size_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.vehicle_size_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vehicle_size_id_seq OWNER TO autobook;

--
-- TOC entry 3290 (class 0 OID 0)
-- Dependencies: 229
-- Name: vehicle_size_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.vehicle_size_id_seq OWNED BY public.vehicle_sizes.id;


--
-- TOC entry 230 (class 1259 OID 41207)
-- Name: vehicle_sizecharts; Type: TABLE; Schema: public; Owner: autobook
--

CREATE TABLE public.vehicle_sizecharts (
    id integer NOT NULL,
    year smallint,
    make character varying,
    model character varying,
    size_id integer,
    dont_quote boolean,
    search character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.vehicle_sizecharts OWNER TO autobook;

--
-- TOC entry 231 (class 1259 OID 41213)
-- Name: vehicle_sizecharts_id_seq; Type: SEQUENCE; Schema: public; Owner: autobook
--

CREATE SEQUENCE public.vehicle_sizecharts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vehicle_sizecharts_id_seq OWNER TO autobook;

--
-- TOC entry 3291 (class 0 OID 0)
-- Dependencies: 231
-- Name: vehicle_sizecharts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: autobook
--

ALTER SEQUENCE public.vehicle_sizecharts_id_seq OWNED BY public.vehicle_sizecharts.id;


--
-- TOC entry 2990 (class 2604 OID 196652)
-- Name: assets id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.assets ALTER COLUMN id SET DEFAULT nextval('public.assets_id_seq'::regclass);


--
-- TOC entry 2976 (class 2604 OID 139288)
-- Name: carriers id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.carriers ALTER COLUMN id SET DEFAULT nextval('public.carriers_id_seq'::regclass);


--
-- TOC entry 2980 (class 2604 OID 147480)
-- Name: dispatches id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.dispatches ALTER COLUMN id SET DEFAULT nextval('public.dispatches_id_seq'::regclass);


--
-- TOC entry 2978 (class 2604 OID 139306)
-- Name: drivers id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.drivers ALTER COLUMN id SET DEFAULT nextval('public.drivers_id_seq'::regclass);


--
-- TOC entry 2944 (class 2604 OID 41216)
-- Name: email_templates id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.email_templates ALTER COLUMN id SET DEFAULT nextval('public.email_templates_id_seq'::regclass);


--
-- TOC entry 2946 (class 2604 OID 41217)
-- Name: events id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- TOC entry 2948 (class 2604 OID 41218)
-- Name: followup_types id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.followup_types ALTER COLUMN id SET DEFAULT nextval('public.followup_types_id_seq'::regclass);


--
-- TOC entry 2950 (class 2604 OID 41219)
-- Name: followups id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.followups ALTER COLUMN id SET DEFAULT nextval('public.followups_id_seq'::regclass);


--
-- TOC entry 2952 (class 2604 OID 41220)
-- Name: mileage_pricings id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.mileage_pricings ALTER COLUMN id SET DEFAULT nextval('public.mileage_pricing_id_seq'::regclass);


--
-- TOC entry 2974 (class 2604 OID 114728)
-- Name: note_assignments id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.note_assignments ALTER COLUMN id SET DEFAULT nextval('public.note_assignments_id_seq'::regclass);


--
-- TOC entry 2992 (class 2604 OID 196664)
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- TOC entry 2988 (class 2604 OID 163966)
-- Name: order_links id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.order_links ALTER COLUMN id SET DEFAULT nextval('public.order_links_id_seq'::regclass);


--
-- TOC entry 2986 (class 2604 OID 163911)
-- Name: payer_billing_methods id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.payer_billing_methods ALTER COLUMN id SET DEFAULT nextval('public.payer_billing_methods_id_seq'::regclass);


--
-- TOC entry 2984 (class 2604 OID 163885)
-- Name: payers id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.payers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- TOC entry 2954 (class 2604 OID 41221)
-- Name: pricing_exceptions id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.pricing_exceptions ALTER COLUMN id SET DEFAULT nextval('public.pricing_exception_id_seq'::regclass);


--
-- TOC entry 2956 (class 2604 OID 41222)
-- Name: quotes id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.quotes ALTER COLUMN id SET DEFAULT nextval('public.quotes_id_seq'::regclass);


--
-- TOC entry 2982 (class 2604 OID 163865)
-- Name: ringcentral_accounts id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.ringcentral_accounts ALTER COLUMN id SET DEFAULT nextval('public.ringcentral_accounts_id_seq'::regclass);


--
-- TOC entry 2972 (class 2604 OID 73775)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 2958 (class 2604 OID 41223)
-- Name: sms_templates id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.sms_templates ALTER COLUMN id SET DEFAULT nextval('public.sms_templates_id_seq'::regclass);


--
-- TOC entry 2960 (class 2604 OID 41224)
-- Name: statuses id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.statuses ALTER COLUMN id SET DEFAULT nextval('public.statuses_id_seq'::regclass);


--
-- TOC entry 2962 (class 2604 OID 41225)
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- TOC entry 2970 (class 2604 OID 57394)
-- Name: us_cities id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.us_cities ALTER COLUMN id SET DEFAULT nextval('public.us_cities_id_seq'::regclass);


--
-- TOC entry 2964 (class 2604 OID 41226)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 2968 (class 2604 OID 41227)
-- Name: vehicle_sizecharts id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.vehicle_sizecharts ALTER COLUMN id SET DEFAULT nextval('public.vehicle_sizecharts_id_seq'::regclass);


--
-- TOC entry 2966 (class 2604 OID 41228)
-- Name: vehicle_sizes id; Type: DEFAULT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.vehicle_sizes ALTER COLUMN id SET DEFAULT nextval('public.vehicle_size_id_seq'::regclass);



--
-- TOC entry 3292 (class 0 OID 0)
-- Dependencies: 252
-- Name: assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.assets_id_seq', 18, true);


--
-- TOC entry 3293 (class 0 OID 0)
-- Dependencies: 238
-- Name: carriers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.carriers_id_seq', 81, true);


--
-- TOC entry 3294 (class 0 OID 0)
-- Dependencies: 246
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, false);


--
-- TOC entry 3295 (class 0 OID 0)
-- Dependencies: 242
-- Name: dispatches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.dispatches_id_seq', 12, true);


--
-- TOC entry 3296 (class 0 OID 0)
-- Dependencies: 240
-- Name: drivers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.drivers_id_seq', 82, true);


--
-- TOC entry 3297 (class 0 OID 0)
-- Dependencies: 207
-- Name: email_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.email_templates_id_seq', 8, true);


--
-- TOC entry 3298 (class 0 OID 0)
-- Dependencies: 209
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.events_id_seq', 1, false);


--
-- TOC entry 3299 (class 0 OID 0)
-- Dependencies: 211
-- Name: followup_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.followup_types_id_seq', 10, true);


--
-- TOC entry 3300 (class 0 OID 0)
-- Dependencies: 213
-- Name: followups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.followups_id_seq', 2, true);


--
-- TOC entry 3301 (class 0 OID 0)
-- Dependencies: 215
-- Name: mileage_pricing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.mileage_pricing_id_seq', 92, true);


--
-- TOC entry 3302 (class 0 OID 0)
-- Dependencies: 236
-- Name: note_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.note_assignments_id_seq', 154, true);


--
-- TOC entry 3303 (class 0 OID 0)
-- Dependencies: 254
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.notes_id_seq', 26, true);


--
-- TOC entry 3304 (class 0 OID 0)
-- Dependencies: 250
-- Name: order_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.order_links_id_seq', 1, false);


--
-- TOC entry 3305 (class 0 OID 0)
-- Dependencies: 248
-- Name: payer_billing_methods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.payer_billing_methods_id_seq', 1, false);


--
-- TOC entry 3306 (class 0 OID 0)
-- Dependencies: 217
-- Name: pricing_exception_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.pricing_exception_id_seq', 17096, true);


--
-- TOC entry 3307 (class 0 OID 0)
-- Dependencies: 219
-- Name: quotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.quotes_id_seq', 1119, true);


--
-- TOC entry 3308 (class 0 OID 0)
-- Dependencies: 244
-- Name: ringcentral_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.ringcentral_accounts_id_seq', 1, true);


--
-- TOC entry 3309 (class 0 OID 0)
-- Dependencies: 234
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.roles_id_seq', 5, true);


--
-- TOC entry 3310 (class 0 OID 0)
-- Dependencies: 221
-- Name: sms_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.sms_templates_id_seq', 6, true);


--
-- TOC entry 3311 (class 0 OID 0)
-- Dependencies: 223
-- Name: statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.statuses_id_seq', 108, true);


--
-- TOC entry 3312 (class 0 OID 0)
-- Dependencies: 225
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);


--
-- TOC entry 3313 (class 0 OID 0)
-- Dependencies: 232
-- Name: us_cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.us_cities_id_seq', 29880, true);


--
-- TOC entry 3314 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.user_id_seq', 30, true);


--
-- TOC entry 3315 (class 0 OID 0)
-- Dependencies: 229
-- Name: vehicle_size_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.vehicle_size_id_seq', 125, true);


--
-- TOC entry 3316 (class 0 OID 0)
-- Dependencies: 231
-- Name: vehicle_sizecharts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: autobook
--

SELECT pg_catalog.setval('public.vehicle_sizecharts_id_seq', 48837, true);


--
-- TOC entry 3060 (class 2606 OID 196658)
-- Name: assets assets_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pk PRIMARY KEY (id);


--
-- TOC entry 3035 (class 2606 OID 139293)
-- Name: carriers carriers_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.carriers
    ADD CONSTRAINT carriers_pk PRIMARY KEY (id);


--
-- TOC entry 3037 (class 2606 OID 139297)
-- Name: carriers carriers_un1; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.carriers
    ADD CONSTRAINT carriers_un1 UNIQUE (dot_number);


--
-- TOC entry 3039 (class 2606 OID 139299)
-- Name: carriers carriers_un2; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.carriers
    ADD CONSTRAINT carriers_un2 UNIQUE (mc_number);


--
-- TOC entry 3043 (class 2606 OID 147486)
-- Name: dispatches dispatches_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.dispatches
    ADD CONSTRAINT dispatches_pk PRIMARY KEY (id);


--
-- TOC entry 3041 (class 2606 OID 139312)
-- Name: drivers drivers_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pk PRIMARY KEY (id);


--
-- TOC entry 2995 (class 2606 OID 41232)
-- Name: email_templates email_templates_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pk PRIMARY KEY (id);


--
-- TOC entry 2997 (class 2606 OID 41234)
-- Name: events events_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pk PRIMARY KEY (id);


--
-- TOC entry 2999 (class 2606 OID 41236)
-- Name: followup_types followup_types_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.followup_types
    ADD CONSTRAINT followup_types_pk PRIMARY KEY (id);


--
-- TOC entry 3001 (class 2606 OID 41238)
-- Name: followups followups_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.followups
    ADD CONSTRAINT followups_pk PRIMARY KEY (id);


--
-- TOC entry 3005 (class 2606 OID 41240)
-- Name: mileage_pricings mileage_pricing_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.mileage_pricings
    ADD CONSTRAINT mileage_pricing_pk PRIMARY KEY (id);


--
-- TOC entry 3031 (class 2606 OID 114731)
-- Name: note_assignments note_assignments_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.note_assignments
    ADD CONSTRAINT note_assignments_pk PRIMARY KEY (id);


--
-- TOC entry 3033 (class 2606 OID 114733)
-- Name: note_assignments note_assignments_uk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.note_assignments
    ADD CONSTRAINT note_assignments_uk UNIQUE (id);


--
-- TOC entry 3062 (class 2606 OID 196673)
-- Name: notes notes_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pk PRIMARY KEY (id);


--
-- TOC entry 3064 (class 2606 OID 196675)
-- Name: notes notes_un; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_un UNIQUE (id);


--
-- TOC entry 3056 (class 2606 OID 163972)
-- Name: order_links order_links_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.order_links
    ADD CONSTRAINT order_links_pk PRIMARY KEY (id);


--
-- TOC entry 3058 (class 2606 OID 163980)
-- Name: order_links order_links_un; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.order_links
    ADD CONSTRAINT order_links_un UNIQUE (encryption);


--
-- TOC entry 3054 (class 2606 OID 163917)
-- Name: payer_billing_methods payer_billing_methods_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.payer_billing_methods
    ADD CONSTRAINT payer_billing_methods_pk PRIMARY KEY (id);


--
-- TOC entry 3049 (class 2606 OID 163898)
-- Name: payers payers_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.payers
    ADD CONSTRAINT payers_pk PRIMARY KEY (id);


--
-- TOC entry 3051 (class 2606 OID 163900)
-- Name: payers payers_un; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.payers
    ADD CONSTRAINT payers_un UNIQUE (email);


--
-- TOC entry 3007 (class 2606 OID 41242)
-- Name: pricing_exceptions pricing_exception_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.pricing_exceptions
    ADD CONSTRAINT pricing_exception_pk PRIMARY KEY (id);


--
-- TOC entry 3009 (class 2606 OID 41244)
-- Name: quotes quotes_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pk PRIMARY KEY (id);


--
-- TOC entry 3045 (class 2606 OID 163871)
-- Name: ringcentral_accounts ringcentral_accounts_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.ringcentral_accounts
    ADD CONSTRAINT ringcentral_accounts_pk PRIMARY KEY (id);


--
-- TOC entry 3047 (class 2606 OID 163873)
-- Name: ringcentral_accounts ringcentral_accounts_un; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.ringcentral_accounts
    ADD CONSTRAINT ringcentral_accounts_un UNIQUE (user_id);


--
-- TOC entry 3027 (class 2606 OID 73781)
-- Name: roles roles_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pk PRIMARY KEY (id);


--
-- TOC entry 3029 (class 2606 OID 73783)
-- Name: roles roles_un; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_un UNIQUE (name);


--
-- TOC entry 3011 (class 2606 OID 41246)
-- Name: sms_templates sms_templates_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.sms_templates
    ADD CONSTRAINT sms_templates_pk PRIMARY KEY (id);


--
-- TOC entry 3013 (class 2606 OID 41248)
-- Name: statuses statuses_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_pk PRIMARY KEY (id);


--
-- TOC entry 3015 (class 2606 OID 41250)
-- Name: transactions transactions_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pk PRIMARY KEY (id);


--
-- TOC entry 3025 (class 2606 OID 57399)
-- Name: us_cities us_cities_pkey; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.us_cities
    ADD CONSTRAINT us_cities_pkey PRIMARY KEY (id);


--
-- TOC entry 3017 (class 2606 OID 41254)
-- Name: users user_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pk PRIMARY KEY (id);


--
-- TOC entry 3019 (class 2606 OID 106517)
-- Name: users users_uk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_uk UNIQUE (id, auth0_id, email);


--
-- TOC entry 3021 (class 2606 OID 41256)
-- Name: vehicle_sizes vehicle_size_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.vehicle_sizes
    ADD CONSTRAINT vehicle_size_pk PRIMARY KEY (id);


--
-- TOC entry 3023 (class 2606 OID 41258)
-- Name: vehicle_sizecharts vehicle_sizecharts_pk; Type: CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.vehicle_sizecharts
    ADD CONSTRAINT vehicle_sizecharts_pk PRIMARY KEY (id);


--
-- TOC entry 3052 (class 1259 OID 163924)
-- Name: payer_billing_methods_anet_payment_profile_id_idx; Type: INDEX; Schema: public; Owner: autobook
--

CREATE INDEX payer_billing_methods_anet_payment_profile_id_idx ON public.payer_billing_methods USING btree (anet_payment_profile_id);


--
-- TOC entry 3077 (class 2606 OID 114734)
-- Name: note_assignments assignee_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.note_assignments
    ADD CONSTRAINT assignee_fk FOREIGN KEY (assignee_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3080 (class 2606 OID 147487)
-- Name: dispatches dispatches_fk1; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.dispatches
    ADD CONSTRAINT dispatches_fk1 FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3081 (class 2606 OID 147492)
-- Name: dispatches dispatches_fk2; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.dispatches
    ADD CONSTRAINT dispatches_fk2 FOREIGN KEY (order_id) REFERENCES public.quotes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3079 (class 2606 OID 139313)
-- Name: drivers drivers_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_fk FOREIGN KEY (carrier_id) REFERENCES public.carriers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3065 (class 2606 OID 41269)
-- Name: followup_types followup_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.followup_types
    ADD CONSTRAINT followup_types_fk FOREIGN KEY (sms_template_id) REFERENCES public.sms_templates(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3066 (class 2606 OID 41274)
-- Name: followups followups_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.followups
    ADD CONSTRAINT followups_fk FOREIGN KEY (type_id) REFERENCES public.followup_types(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3067 (class 2606 OID 155670)
-- Name: followups followups_fk1; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.followups
    ADD CONSTRAINT followups_fk1 FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3078 (class 2606 OID 196681)
-- Name: note_assignments note_assignments_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.note_assignments
    ADD CONSTRAINT note_assignments_fk FOREIGN KEY (note_id) REFERENCES public.notes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3085 (class 2606 OID 196676)
-- Name: notes notes_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3084 (class 2606 OID 163973)
-- Name: order_links order_links_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.order_links
    ADD CONSTRAINT order_links_fk FOREIGN KEY (order_id) REFERENCES public.quotes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3083 (class 2606 OID 163918)
-- Name: payer_billing_methods payer_billing_methods_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.payer_billing_methods
    ADD CONSTRAINT payer_billing_methods_fk FOREIGN KEY (payer_id) REFERENCES public.payers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3070 (class 2606 OID 163901)
-- Name: quotes quotes_payers_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_payers_fk FOREIGN KEY (payer_id) REFERENCES public.payers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3069 (class 2606 OID 81944)
-- Name: quotes quotes_statuses_child_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_statuses_child_fk FOREIGN KEY (child_status_id) REFERENCES public.statuses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3068 (class 2606 OID 81939)
-- Name: quotes quotes_statuses_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_statuses_parent_fk FOREIGN KEY (parent_status_id) REFERENCES public.statuses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3082 (class 2606 OID 163874)
-- Name: ringcentral_accounts ringcentral_accounts_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.ringcentral_accounts
    ADD CONSTRAINT ringcentral_accounts_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3071 (class 2606 OID 41279)
-- Name: statuses statuses_email_templates_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_email_templates_fk FOREIGN KEY (email_template_id) REFERENCES public.email_templates(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3072 (class 2606 OID 41284)
-- Name: statuses statuses_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_fk FOREIGN KEY (parent_id) REFERENCES public.statuses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3073 (class 2606 OID 41289)
-- Name: statuses statuses_sms_templates_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_sms_templates_fk FOREIGN KEY (sms_template_id) REFERENCES public.sms_templates(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3074 (class 2606 OID 41294)
-- Name: transactions transactions_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_fk FOREIGN KEY (order_id) REFERENCES public.quotes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3075 (class 2606 OID 73784)
-- Name: users users_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_fk FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3076 (class 2606 OID 41299)
-- Name: vehicle_sizecharts vehicle_sizecharts_fk; Type: FK CONSTRAINT; Schema: public; Owner: autobook
--

ALTER TABLE ONLY public.vehicle_sizecharts
    ADD CONSTRAINT vehicle_sizecharts_fk FOREIGN KEY (size_id) REFERENCES public.vehicle_sizes(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2020-09-29 05:36:34 EDT

--
-- PostgreSQL database dump complete
--

