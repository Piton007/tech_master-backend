--
-- PostgreSQL database dump
--

-- Dumped from database version 12.7 (Ubuntu 12.7-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.7 (Ubuntu 12.7-0ubuntu0.20.04.1)

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

--
-- Data for Name: prioridades; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.prioridades (id, label, sla, "createdAt", "updatedAt") VALUES (2, 'Alto', 36, NULL, NULL);
INSERT INTO public.prioridades (id, label, sla, "createdAt", "updatedAt") VALUES (3, 'Medio', 48, NULL, NULL);
INSERT INTO public.prioridades (id, label, sla, "createdAt", "updatedAt") VALUES (4, 'Bajo', 72, NULL, NULL);
INSERT INTO public.prioridades (id, label, sla, "createdAt", "updatedAt") VALUES (1, 'Crítico', 24, NULL, NULL);


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categorias (id, servicio, categoria, subcategoria, "createdAt", "updatedAt", prioridad_id) VALUES (1, 'Internet', 'Pérdida de conexion a internet', '', '2021-06-22 01:53:00.284+00', '2021-06-22 01:53:00.284+00', 1);
INSERT INTO public.categorias (id, servicio, categoria, subcategoria, "createdAt", "updatedAt", prioridad_id) VALUES (2, 'Correo Corporativo', 'Inconvenientes para el acceso', 'Inconvenientes para el acceso', '2021-07-07 23:54:59.379+00', '2021-07-07 23:54:59.379+00', 3);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, "firstName", "lastName", rol, email, dni, password, confirmed, priority, "educationalInstitution", "createdAt", "updatedAt") VALUES (1, 'Martin', 'Lazo Huaraccallo', 'admin', 'mjlazoh@gmail.com', '12045038', '$2b$12$khq/pyP6UZ7P3inljRD9N.3rmW6fKUZ/vPVLf3kHwT8JSGIfhdWIy', true, 'high', NULL, '2021-06-12 20:34:19+00', '2021-06-13 05:45:13.314+00');
INSERT INTO public.users (id, "firstName", "lastName", rol, email, dni, password, confirmed, priority, "educationalInstitution", "createdAt", "updatedAt") VALUES (5, 'Pepe', 'Picapiedra', 'teacher', 'pedro_picapiedra2@gmail.com', '09045096', '$2b$12$wdnSNDsepwxgyU.uFYgRMuA7wpH839/LGd9pEwkEgJf/cxPnW.Vji', true, 'high', 'Trilce', '2021-06-13 07:23:06+00', '2021-06-13 12:25:26.819+00');
INSERT INTO public.users (id, "firstName", "lastName", rol, email, dni, password, confirmed, priority, "educationalInstitution", "createdAt", "updatedAt") VALUES (6, 'Pepe', 'Técnico', 'tech', 'pepe_tecnico@gmail.com', '09455096', '$2b$12$XO2jkNYW/pUJ/whZdnHZfe4Qj7kj.vYdHZm2avuXfLHGYVYxhGnXW', true, 'high', NULL, '2021-06-13 07:23:06+00', '2021-06-13 12:27:10.97+00');
INSERT INTO public.users (id, "firstName", "lastName", rol, email, dni, password, confirmed, priority, "educationalInstitution", "createdAt", "updatedAt") VALUES (7, 'Juan', 'Lazo', 'tech', 'tecnico01@gmail.com', '12345678', '$2b$12$FRIfonSkg6.Ld1WII6N2X.n/EgxxZuYXV5SE6z9xY9iyi0cP1J4LW', true, 'high', '', '2021-06-27 09:10:50+00', '2021-07-07 23:42:14.743+00');


--
-- Data for Name: incidentes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.incidentes (id, code, description, status, document_urns, "fechaAsignacion", "fechaCierre", "createdAt", "updatedAt", categoria_id, usuario_afectado_id, usuario_solicitante_id, supervisor_id) VALUES (7, 'INC0007', 'Prueba testing', 'pending', '1624801937842-pendiente_helpdesk.docx', NULL, NULL, '2021-06-27 13:52:19.851+00', '2021-06-27 13:52:19.86+00', 1, 5, 5, NULL);
INSERT INTO public.incidentes (id, code, description, status, document_urns, "fechaAsignacion", "fechaCierre", "createdAt", "updatedAt", categoria_id, usuario_afectado_id, usuario_solicitante_id, supervisor_id) VALUES (8, 'INC0008', 'Inconvenientes con el acceso a Internet', 'in_process', '', '2021-07-03 16:30:16+00', NULL, '2021-07-03 21:29:41.601+00', '2021-07-03 21:30:16.94+00', 1, 5, 5, 6);
INSERT INTO public.incidentes (id, code, description, status, document_urns, "fechaAsignacion", "fechaCierre", "createdAt", "updatedAt", categoria_id, usuario_afectado_id, usuario_solicitante_id, supervisor_id) VALUES (9, 'INC0009', 'No tengo acceso a Internet', 'in_process', '1625700817349-prueba.txt', '2021-07-07 19:07:34+00', NULL, '2021-07-07 23:33:39.527+00', '2021-07-08 00:07:34.438+00', 1, 5, 5, 7);


--
-- Data for Name: incident_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.incident_logs (id, comment, event, tipo, status, "createdAt", "updatedAt", incidente_id) VALUES (7, '
                            evento: Creación de incidente
                            Ha sido creado por Pepe con dni 09045096
                            para Pepe con dni 09045096
                            ', 'Pepe ha notificado un incidente', 'incidente', 'pending', '2021-06-27 13:52:19.872+00', '2021-06-27 13:52:19.872+00', 7);
INSERT INTO public.incident_logs (id, comment, event, tipo, status, "createdAt", "updatedAt", incidente_id) VALUES (8, '
                            evento: Creación de incidente
                            Ha sido creado por Pepe con dni 09045096
                            para Pepe con dni 09045096
                            ', 'Pepe ha notificado un incidente', 'incidente', 'pending', '2021-07-03 21:29:41.643+00', '2021-07-03 21:29:41.643+00', 8);
INSERT INTO public.incident_logs (id, comment, event, tipo, status, "createdAt", "updatedAt", incidente_id) VALUES (9, '
                                    El incidente ha sido asignado a Pepe 
                                    ', 'Pepe con email: pepe_tecnico@gmail.com ha tomado el incidente', 'incidente', 'in_process', '2021-07-03 21:30:16.953+00', '2021-07-03 21:30:16.953+00', 8);
INSERT INTO public.incident_logs (id, comment, event, tipo, status, "createdAt", "updatedAt", incidente_id) VALUES (10, '
                            Pepe con email: pepe_tecnico@gmail.com y dni 09455096 
                            Favor de confirmar que tipo de inconveniente con el servicio de internet tiene. 
- No tiene conexión
- Inconvenientes de Lentitud

', 'Pepe ha comentado', 'incidente', 'comment', '2021-07-03 21:31:24.093+00', '2021-07-03 21:31:24.093+00', 8);
INSERT INTO public.incident_logs (id, comment, event, tipo, status, "createdAt", "updatedAt", incidente_id) VALUES (11, '
                            evento: Creación de incidente
                            Ha sido creado por Pepe con dni 09045096
                            para Pepe con dni 09045096
                            ', 'Pepe ha notificado un incidente', 'incidente', 'pending', '2021-07-07 23:33:39.546+00', '2021-07-07 23:33:39.546+00', 9);
INSERT INTO public.incident_logs (id, comment, event, tipo, status, "createdAt", "updatedAt", incidente_id) VALUES (12, '
                                    El incidente ha sido asignado a Pepe 
                                    ', 'Pepe con email: pepe_tecnico@gmail.com ha tomado el incidente', 'incidente', 'in_process', '2021-07-07 23:34:00.32+00', '2021-07-07 23:34:00.32+00', 9);
INSERT INTO public.incident_logs (id, comment, event, tipo, status, "createdAt", "updatedAt", incidente_id) VALUES (13, '
                                    El incidente ha sido asignado a Juan 
                                    ', 'Juan con email: tecnico01@gmail.com ha tomado el incidente', 'incidente', 'in_process', '2021-07-08 00:07:34.45+00', '2021-07-08 00:07:34.45+00', 9);


--
-- Data for Name: requerimientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.requerimientos (id, code, categories, description, status, document_urns, "fechaAsignacion", "fechaCierre", "createdAt", "updatedAt", user_id, supervisor_id) VALUES (1, 'REQ0001', 'Crear usuario;Voluntario;12345677;mlazope@outlook.com;Martin;Huaraccallo;Santa Fe;high', '
                Nombre Completo: Martin Huaraccallo
                DNI:12345677
                Email: mlazope@outlook.com
                Tipo Usuario: Voluntario
                Institución: Santa Fe
                Prioridad : Alta

                Favor de registrar usuario para Martin
                ', 'closed', '1623896917041-silo.tips_acl-intermedio-acl-audit-command-language-lenguaje-de-comandos-de-auditoria.pdf', '2021-07-07 18:39:00+00', '2021-07-07 18:41:42+00', '2021-06-17 02:28:39.479+00', '2021-07-07 23:41:42.908+00', 5, 1);


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.logs (id, comment, event, tipo, status, "createdAt", "updatedAt", requerimiento_id) VALUES (1, '
                            evento: Creación de requerimiento
                            Ha sido creado por Pepe con dni 09045096', 'Pepe ha solicitado un requerimiento', 'requerimiento', 'pending', '2021-06-17 02:28:39.499+00', '2021-06-17 02:28:39.499+00', 1);
INSERT INTO public.logs (id, comment, event, tipo, status, "createdAt", "updatedAt", requerimiento_id) VALUES (2, '
                                    El Requerimiento ha sido asignado a Pepe con email: pepe_tecnico@gmail.com
                                    ', 'Pepe ha tomado el requerimiento', 'requerimiento', 'in_process', '2021-06-17 02:29:57.19+00', '2021-06-17 02:29:57.19+00', 1);
INSERT INTO public.logs (id, comment, event, tipo, status, "createdAt", "updatedAt", requerimiento_id) VALUES (3, '
                                    El Requerimiento ha sido asignado a Martin con email: mjlazoh@gmail.com
                                    ', 'Martin ha tomado el requerimiento', 'requerimiento', 'in_process', '2021-07-07 23:39:00.371+00', '2021-07-07 23:39:00.371+00', 1);
INSERT INTO public.logs (id, comment, event, tipo, status, "createdAt", "updatedAt", requerimiento_id) VALUES (4, 'La contraseña asignada es GwvDiqgHaZ', 'Martin ha resuelto el requerimiento', 'requerimiento', 'resolved', '2021-07-07 23:41:19.316+00', '2021-07-07 23:41:19.316+00', 1);
INSERT INTO public.logs (id, comment, event, tipo, status, "createdAt", "updatedAt", requerimiento_id) VALUES (5, 'Gracias', 'Pepe ha aceptado la resolución', 'requerimiento', 'closed', '2021-07-07 23:41:42.919+00', '2021-07-07 23:41:42.919+00', 1);


--
-- Data for Name: user_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_logs (id, "createdAt", "updatedAt", user_id, requerimiento_id) VALUES (1, '2021-07-07 23:39:56.006+00', '2021-07-07 23:39:56.006+00', 7, 1);


--
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_seq', 2, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: incident_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.incident_logs_id_seq', 13, true);


--
-- Name: incidentes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.incidentes_id_seq', 9, true);


--
-- Name: logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_id_seq', 5, true);


--
-- Name: prioridades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prioridades_id_seq', 4, true);


--
-- Name: requerimientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requerimientos_id_seq', 1, true);


--
-- Name: user_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_logs_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- PostgreSQL database dump complete
--

