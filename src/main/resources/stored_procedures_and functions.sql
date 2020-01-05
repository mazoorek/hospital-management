drop procedure if exists create_database;
drop procedure if exists drop_old_tables;
drop procedure if exists create_new_tables;
drop procedure if exists fill_tables_with_values;
drop procedure if exists insert_doctor;
drop procedure if exists update_doctor;
drop procedure if exists insert_staff_member;
drop procedure if exists update_staff_member;
drop function if exists count_tables;


create procedure create_database()
begin
    CREATE DATABASE IF NOT EXISTS hospital_management;
--     use hospital_management
    call drop_old_tables();
    call create_new_tables();
    call fill_tables_with_values();
end;

create procedure drop_old_tables()
begin
    SET FOREIGN_KEY_CHECKS = 0;
    drop table if exists specjalizacja;
    drop table if exists funkcja;
    drop table if exists pracownik;
    drop table if exists lekarz;
    drop table if exists personel;
    drop table if exists oddzial;
    drop table if exists pokoj;
    drop table if exists pacjent;
    drop table if exists urlop;
    drop table if exists typ_operacji;
    drop table if exists charakter_wizyty;
    drop table if exists wizyta;
    SET FOREIGN_KEY_CHECKS = 1;
end;

create procedure create_new_tables()
begin
    create table specjalizacja
    (
        specjalizacja_id integer      not null auto_increment,
        nazwa            varchar(100) not null,
        primary key (specjalizacja_id)
    ) ENGINE = InnoDB
      AUTO_INCREMENT = 1
      DEFAULT charset = utf8
      COLLATE utf8_unicode_ci;

    alter table specjalizacja
        add constraint specjalizacja_u_1 unique (nazwa);

    create table funkcja
    (
        funkcja_id integer      not null auto_increment,
        nazwa      varchar(100) not null,
        primary key (funkcja_id)
    ) DEFAULT charset = utf8
      COLLATE utf8_unicode_ci;

    alter table funkcja
        add constraint funkcja_u_1 unique (nazwa);

    create table pracownik
    (
        pracownik_id integer      not null auto_increment,
        imie         varchar(100) not null,
        nazwisko      varchar(100) not null,
        typ          varchar(100) not null,
        primary key (pracownik_id)
    ) ENGINE = InnoDB
      AUTO_INCREMENT = 1
      DEFAULT charset = utf8
      COLLATE utf8_unicode_ci;

     create table oddzial
    (
        oddzial_id integer      not null auto_increment,
        nazwa      varchar(100) not null,
        primary key (oddzial_id)
    ) ENGINE = InnoDB
      AUTO_INCREMENT = 1
      DEFAULT charset = utf8
      COLLATE utf8_unicode_ci;

    alter table oddzial
        add constraint oddzial_u_1 unique (nazwa);

    create table lekarz
    (
        lekarz_id        integer not null auto_increment,
        pracownik_id     integer not null,
        specjalizacja_id integer not null,
        oddzial_id       integer not null,
        primary key (lekarz_id)
    ) ENGINE = InnoDB
      AUTO_INCREMENT = 1
      DEFAULT charset = utf8
      COLLATE utf8_unicode_ci;

    alter table lekarz
        add constraint lekarz_fk_id foreign key (lekarz_id) references pracownik (pracownik_id) on delete cascade;
    alter table lekarz
        add constraint lekarz_fk_specjalizacja_id foreign key (specjalizacja_id) references specjalizacja (specjalizacja_id) on delete cascade;
    alter table lekarz
        add constraint lekarz_fk_oddzial_id foreign key (oddzial_id) references oddzial (oddzial_id) on delete cascade;
    alter table lekarz
        add constraint lekarz_u_1 unique (pracownik_id, specjalizacja_id);

    create table personel
    (
        personel_id  integer not null auto_increment,
        pracownik_id integer not null,
        funkcja_id   integer not null,
        primary key (personel_id, funkcja_id)

    ) ENGINE = InnoDB
      AUTO_INCREMENT = 1
      DEFAULT charset = utf8
      COLLATE utf8_unicode_ci;

    alter table personel
        add constraint staff_fk_id foreign key (personel_id) references pracownik (pracownik_id) on delete cascade;
    alter table personel
        add constraint staff_fk_funkcja foreign key (funkcja_id) references funkcja (funkcja_id) on delete cascade;
    alter table personel
        add constraint personel_u_1 unique (pracownik_id, funkcja_id);

    create table pokoj
    (
        pokoj_id   integer not null auto_increment,
        numer      integer not null,
        oddzial_id integer not null,
        primary key (pokoj_id)
    ) ENGINE = InnoDB
      AUTO_INCREMENT = 1
      DEFAULT charset = utf8
      COLLATE utf8_unicode_ci;

    alter table pokoj
        add constraint pokoj_fk_oddzial_id foreign key (oddzial_id) references oddzial (oddzial_id) on delete cascade;
    alter table pokoj
        add constraint pokoj_u_1 unique (numer, oddzial_id);

    create table pacjent
    (
        pacjent_id integer      not null auto_increment,
        pesel      varchar(100) not null,
        imie       varchar(100) not null,
        nazwisko   varchar(100) not null,
        primary key (pacjent_id)
    ) ENGINE = InnoDB
      AUTO_INCREMENT = 1
      DEFAULT charset = utf8
      COLLATE utf8_unicode_ci;

    alter table pacjent
        add constraint pacjent_u_1 unique (pesel);


    create table urlop
    (
        urlop_id            integer      not null auto_increment,
        data_rozpoczecia    varchar(100) not null,
        data_zakonczenia    varchar(100) not null,
        pracownik_id       integer      not null,
        primary key (urlop_id)
    ) ENGINE = InnoDB
      AUTO_INCREMENT = 1
      DEFAULT charset = utf8
      COLLATE utf8_unicode_ci;

    alter table urlop
        add constraint leave_of_absence_fk_id foreign key (pracownik_id) references pracownik (pracownik_id) on delete cascade;
    alter table urlop
        add constraint urlop_u_1 unique (pracownik_id, data_rozpoczecia);

    create table typ_operacji
    (
        typ_operacji_id  integer      not null auto_increment,
        typ              varchar(100) not null,
        specjalizacja_id integer      not null,
        primary key (typ_operacji_id)
    ) ENGINE = InnoDB
      AUTO_INCREMENT = 1
      DEFAULT charset = utf8
      COLLATE utf8_unicode_ci;

    alter table typ_operacji
        add constraint typ_operacji_fk_specjalizacja foreign key (specjalizacja_id) references specjalizacja (specjalizacja_id) on delete cascade;
    alter table typ_operacji
        add constraint typ_operacji_u_1 unique (typ);

    create table charakter_wizyty
    (
        charakter_wizyty_id integer      not null auto_increment,
        charakter           varchar(100) not null,
        specjalizacja_id    integer      not null,
        primary key (charakter_wizyty_id)
    ) ENGINE = InnoDB
      AUTO_INCREMENT = 1
      DEFAULT charset = utf8
      COLLATE utf8_unicode_ci;

    alter table charakter_wizyty
        add constraint charakter_wizyty_fk_specjalizacja foreign key (specjalizacja_id) references specjalizacja (specjalizacja_id) on delete cascade;
    alter table charakter_wizyty
        add constraint charakter_wizyty_u_1 unique (charakter);

    create table wizyta
    (
        wizyta_id                  integer      not null auto_increment,
        data_poczatku       varchar(100) not null,
        data_konca          varchar(100) not null,
        pacjent_id          integer      not null,
        lekarz_id           integer      not null,
        pokoj_id            integer      not null,
        charakter_wizyty_id integer      not null,
        typ_operacji_id     integer,
        primary key (wizyta_id)
    ) ENGINE = InnoDB
      AUTO_INCREMENT = 1
      DEFAULT charset = utf8
      COLLATE utf8_unicode_ci;

    alter table wizyta
        add constraint wizyta_fk_patient_pacjent_id foreign key (pacjent_id) references pacjent (pacjent_id) on delete cascade;
    alter table wizyta
        add constraint wizyta_fk_patient_doctor_id foreign key (lekarz_id) references lekarz (lekarz_id) on delete cascade;
    alter table wizyta
        add constraint wizyta_fk_patient_pokoj_id foreign key (pokoj_id) references pokoj (pokoj_id) on delete cascade;
    alter table wizyta
        add constraint wizyta_fk_patient_charakter_wizyty_id foreign key (charakter_wizyty_id) references charakter_wizyty (charakter_wizyty_id) on delete cascade;
    alter table wizyta
        add constraint wizyta_fk_patient_typ_operacji_id foreign key (typ_operacji_id) references typ_operacji (typ_operacji_id) on delete cascade;
    alter table wizyta
        add constraint wizyta_u_1 unique (data_poczatku, pacjent_id);
end;

create procedure fill_tables_with_values()
begin
    insert into specjalizacja(nazwa)
    values ('chirurgia');
    insert into specjalizacja(nazwa)
    values ('pediatria');
    insert into specjalizacja(nazwa)
    values ('kardiochirurgia');
    insert into specjalizacja(nazwa)
    values ('dermatologia');
    insert into specjalizacja(nazwa)
    values ('neurologia');
    insert into specjalizacja(nazwa)
    values ('okulistyka');
    insert into specjalizacja(nazwa)
    values ('urologia');

    insert into funkcja(nazwa)
    values ('pielegniarka');
    insert into funkcja(nazwa)
    values ('sprzataczka');
    insert into funkcja(nazwa)
    values ('recepcjonistka');
    insert into funkcja(nazwa)
    values ('anestezjolog');

    insert into pracownik(imie, nazwisko, typ)
    values ('Jan', 'Kowalski', 'lekarz');
    insert into pracownik(imie, nazwisko, typ)
    values ('Franciszek', 'Piekarz', 'lekarz');
    insert into pracownik(imie, nazwisko, typ)
    values ('Kamila', 'Sikorska', 'lekarz');
    insert into pracownik(imie, nazwisko, typ)
    values ('Zbigniew', 'Ratajski', 'personel');
    insert into pracownik(imie, nazwisko, typ)
    values ('Julia', 'Skrzypczak', 'personel');
    insert into pracownik(imie, nazwisko, typ)
    values ('Zuzanna', 'Skrzypczak', 'personel');

    insert into oddzial(nazwa)
    values ('oddzial chirurgiczny');
    insert into oddzial(nazwa)
    values ('oddzial pediatryczny');
    insert into oddzial(nazwa)
    values ('oddzial okulistyczny');
    insert into oddzial(nazwa)
    values ('oddzial ginekologiczny');
    insert into oddzial(nazwa)
    values ('oddzial rehabilitacji');
    insert into oddzial(nazwa)
    values ('oddzial onkologiczny');

    insert into lekarz(pracownik_id, specjalizacja_id, oddzial_id)
    values (1, 1, 1);
    insert into lekarz(pracownik_id, specjalizacja_id, oddzial_id)
    values (2, 2, 2);
    insert into lekarz(pracownik_id, specjalizacja_id, oddzial_id)
    values (3, 3, 3);

    insert into personel(pracownik_id, funkcja_id)
    values (4, 1);
    insert into personel(pracownik_id, funkcja_id)
    values (5, 2);
    insert into personel(pracownik_id, funkcja_id)
    values (6, 3);

    insert into pokoj(numer, oddzial_id)
    values (1, 1);
    insert into pokoj(numer, oddzial_id)
    values (2, 1);
    insert into pokoj(numer, oddzial_id)
    values (3, 1);
    insert into pokoj(numer, oddzial_id)
    values (1, 2);
    insert into pokoj(numer, oddzial_id)
    values (2, 2);
    insert into pokoj(numer, oddzial_id)
    values (3, 2);
    insert into pokoj(numer, oddzial_id)
    values (1, 3);
    insert into pokoj(numer, oddzial_id)
    values (2, 3);
    insert into pokoj(numer, oddzial_id)
    values (3, 3);
    insert into pokoj(numer, oddzial_id)
    values (1, 4);
    insert into pokoj(numer, oddzial_id)
    values (2, 4);
    insert into pokoj(numer, oddzial_id)
    values (3, 4);
    insert into pokoj(numer, oddzial_id)
    values (1, 5);
    insert into pokoj(numer, oddzial_id)
    values (2, 5);
    insert into pokoj(numer, oddzial_id)
    values (3, 5);

    insert into pacjent(pesel, imie, nazwisko)
    VALUES ('57060734835', 'Wojciech', 'Mlynarski');
    insert into pacjent(pesel, imie, nazwisko)
    VALUES ('92051246964', 'Maciej', 'Musial');
    insert into pacjent(pesel, imie, nazwisko)
    VALUES ('64092774485', 'Konstanty', 'Malinowski');

    insert into urlop(data_rozpoczecia, data_zakonczenia, pracownik_id)
    VALUES (current_date, date_add(current_date, interval 7 day), 1);

    insert into typ_operacji(typ, specjalizacja_id)
    values ('serca', 1);
    insert into typ_operacji(typ, specjalizacja_id)
    values ('kolana', 1);
    insert into typ_operacji(typ, specjalizacja_id)
    values ('oczu', 1);
    insert into typ_operacji(typ, specjalizacja_id)
    values ('mózgu', 1);
    insert into typ_operacji(typ, specjalizacja_id)
    values ('nowotworowa', 1);

    insert into charakter_wizyty(charakter, specjalizacja_id)
    values ('konsultacja', 1);
    insert into charakter_wizyty(charakter, specjalizacja_id)
    values ('wizyta', 1);
    insert into charakter_wizyty(charakter, specjalizacja_id)
    values ('usg', 1);
    insert into charakter_wizyty(charakter, specjalizacja_id)
    values ('operacja', 1);

    insert into wizyta(data_poczatku, data_konca, pacjent_id, lekarz_id, pokoj_id, charakter_wizyty_id)
    VALUES (current_date, date_add(current_date, interval 1 hour), 1, 3, 4, 1);
end;

create function count_tables()
    returns integer
begin
    return
        (select count(*)
         FROM INFORMATION_SCHEMA.TABLES
         WHERE TABLE_TYPE = 'BASE TABLE'
           AND TABLE_SCHEMA = 'hospital_management');
end;

create procedure insert_doctor(name varchar(128), surname varchar(128), specialization varchar(128),
                               hospital_ward varchar(128))
begin
    insert into pracownik(imie, nazwisko, typ) VALUES (name, surname, 'lekarz');
    insert into lekarz(pracownik_id, specjalizacja_id, oddzial_id)
    VALUES ((select pracownik_id
             from pracownik
             where imie = name
               and nazwisko = surname
             order by pracownik_id desc
             limit 1
            ), (select specjalizacja_id from specjalizacja where nazwa = specialization),
            (select oddzial_id from oddzial where nazwa = hospital_ward));
end;

create procedure update_doctor(employee_id integer, name varchar(128), surname varchar(128), specialization varchar(128),
                               hospital_ward varchar(128))
begin
    update pracownik
        set
        imie = name,
        nazwisko = surname
    where pracownik_id = employee_id;
    update lekarz
    set
    specjalizacja_id = (select specjalizacja_id from specjalizacja where nazwa = specialization),
    oddzial_id = (select oddzial_id from oddzial where nazwa = hospital_ward)
    where pracownik_id = employee_id;
end;

create procedure insert_staff_member(name varchar(128), surname varchar(128), function varchar(128))
begin
    insert into pracownik(imie, nazwisko, typ) VALUES (name, surname, 'personel');
    insert into personel(pracownik_id, funkcja_id)
    VALUES ((select pracownik_id
             from pracownik
             where imie = name
               and nazwisko = surname
             order by pracownik_id desc
             limit 1
            ), (select funkcja_id from funkcja where nazwa = function));
end;

create procedure update_staff_member(employee_id integer, name varchar(128), surname varchar(128), function varchar(128))
begin
    update pracownik
    set
        imie = name,
        nazwisko = surname
    where pracownik_id = employee_id;
    update personel
    set
        funkcja_id = (select funkcja_id from funkcja where nazwa = function)
    where pracownik_id = employee_id;
end;
