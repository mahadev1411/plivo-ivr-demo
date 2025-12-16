📞 Plivo Multi-Level IVR Demo

This repository contains a demo implementation of a multi-level IVR (Interactive Voice Response) system built using Plivo’s Voice API and Node.js.

The project demonstrates how to initiate outbound calls, handle DTMF-based user input, and route calls dynamically using Plivo XML webhooks.

📌 Features Implemented

Outbound call initiation using Plivo API

Multi-level IVR menu

Language selection (English / Spanish)

DTMF input handling using GetDigits

Audio playback

Simulated customer care handling

Graceful handling of invalid or no input

Secure credential management using environment variables

🧱 System Architecture Overview

The system consists of two main components:

Outbound Call Trigger

An HTTP endpoint that initiates a call using Plivo’s calls.create() API.

IVR Engine (Webhook Driven)

A set of webhook endpoints that return Plivo XML instructions.

These control the call flow based on user input.

Ngrok is used to expose the local Express server to the public internet so that Plivo can reach the webhook endpoints.

🔁 Call Flow

An outbound call is triggered using the /call endpoint.

When the call is answered, Plivo requests instructions from /ivr.

Level 1 IVR:

  Press 1 → English

  Press 2 → Spanish

Level 2 IVR (language aware):

  Press 1 → Play an audio message

  Press 2 → Simulated customer care message

  Invalid or missing input is handled gracefully.

  The call ends with a polite closing message.

🛠️ Tech Stack

  Node.js

  Express.js

  Plivo Node SDK

  Plivo XML

  Ngrok

  dotenv
