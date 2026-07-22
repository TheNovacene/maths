# How to adapt the starter for your context

The four pillars in `SKILL.md` are domain-neutral. They stay as they are. What you fill in is the **Your context** block at the foot of the file. Four short sections, plain English. The agent will defer to whatever you put there.

You should aim for a single page of additions, not a manifesto. Specificity beats length.

---

## Section 1 — Who you are and what this is for

One or two sentences. The agent uses this to decide *when* the skill is relevant (it activates at the start of any session, but knowing your context shapes its responses throughout).

**Examples:**

- *"I am a SENCo at a maintained primary. This skill applies to any session touching learner data, behaviour records, or EHCP planning."*
- *"I am a freelance journalist working on long-form investigations. This skill applies to any session touching contacts, source notes, or draft copy."*
- *"I am the founder of a small mental health charity. This skill applies to any session touching donor records, beneficiary case files, or trustee correspondence."*
- *"I am a paediatric clinician in private practice. This skill applies to any session touching patient material, parent communications, or clinical record drafting."*
- *"I am a solo solicitor doing family law. This skill applies to any session touching client material, court bundles, or correspondence with opposing counsel."*

If your role spans more than one of these, write one sentence per role.

---

## Section 2 — Authoritative sources

A list of the regulations, codes, standards, or guidance the agent must **defer to rather than paraphrase**. The agent will refer to these accurately or not at all, and will flag uncertainty rather than bluff.

This is the single most powerful section. Models confabulate most often when they're filling in regulatory or standards detail they don't actually know. Naming the sources explicitly — and asking the agent to flag uncertainty — cuts that risk substantially.

**Examples by context:**

- *Schools and AP:* KCSIE 2025 · ICO Children's Code · Online Safety Act 2023 · ISI Independent School Standards (Parts 1–8) · OEAS accreditation criteria · Working Together to Safeguard Children 2023 · SEND Code of Practice 2015 · Equality Act 2010
- *Charities:* Charity Commission CC3 (the Essential Trustee) · CC8 · CC25 · UK GDPR · ICO guidance for charities · the charity's own governing document
- *Clinical practice:* GMC Good Medical Practice · NICE guidelines relevant to your specialism · the Caldicott Principles · UK GDPR · HIPAA (if US)
- *Journalism:* Editors' Code of Practice · IPSO guidance · the publication's own editorial code · whistleblower protection law relevant to your jurisdiction
- *Legal practice:* SRA Standards and Regulations · your firm's conflicts policy · client confidentiality obligations · relevant procedural rules

Pick what applies to you. Be specific (named documents, current versions). The agent will treat anything on this list as a source it should not paraphrase or replace.

---

## Section 3 — Naming discipline

The default position: **the agent does not name individuals** — colleagues, clients, patients, learners, family members, sources, governors, beneficiaries — in any written output unless you give explicit per-output consent. Roles can be referenced (*"the DSL"*, *"the editor"*, *"the lead clinician"*) rather than named individuals.

In this section, you write any deviations from that default. Most users just need to list themselves as the one person who can be named in outputs about their own work.

**Examples:**

- *"I (Jane Smith) may be named in outputs as 'Jane Smith' or 'Director, [Org]'. No other individuals may be named in any output without my explicit per-output consent. Roles are fine: the DSL, the proprietor, the SENCo, the head."*
- *"I (Dr Alex Chen) may be named in clinical correspondence and consent forms. Patient names must never appear in any output — initials only, and only when I explicitly include them in the prompt."*
- *"I (Sam Patel) may be named in published copy. Sources may never be named unless I explicitly mark them as 'on the record'. Drafts default to attributing material to 'a source familiar with…' until I say otherwise."*

This block is load-bearing. The agent will follow it strictly.

---

## Section 4 — Additional consent gates

The default list in `SKILL.md` already covers: publishing, pushing to git, editing policy/safeguarding/compliance docs, writing outside scope, sending externally, browser actions on your behalf, sub-agents, child/vulnerable-adult data, and financial actions.

In this section, you add anything specific to your context that should require an explicit ask every time. The default list still applies — you are extending it, not replacing it.

**Examples by context:**

- *Schools:* "Any text destined for a parent / carer email. Any reference to a specific safeguarding incident, even hypothetically. Any output naming a specific commissioning local authority."
- *Clinical:* "Any draft referral letter. Any text destined for the patient record. Any communication with another clinical professional about a specific patient."
- *Journalism:* "Any text quoting source material verbatim. Any reference to an unpublished investigation. Any communication with a source via any channel."
- *Charities:* "Any text destined for a donor, trustee, or beneficiary. Any reference to a specific safeguarding concern. Any output that names a funder or grant award not yet announced."

Be specific about *the action*, not just *the topic*. The agent gates on action.

---

## After you've filled it in

1. Save the file.
2. Re-install / reload the skill in your Claude setup (Cowork: restart; Claude Code: new session).
3. **Test it.** Start a session, ask the agent to do something that should hit one of your gates, and check that it actually stops and asks. If it doesn't, your phrasing in **Your context** may need to be more specific.
4. If you find the agent drifting in a way the protocol should have caught, that is feedback worth recording. Update the **Your context** block — the protocol is yours to evolve.

If you find a category of failure that feels like it should be in the four pillars themselves rather than your overlay, please open an issue on the [repository](https://github.com/TheNovacene/verse-ality-cowork-starter). The starter improves with use.

---

## What not to do

- **Don't remove items from the default consent gate list.** You can extend; removing is a step backwards.
- **Don't write the overlay in the agent's voice.** The skill is the user's instruction to the agent, not a personality the agent adopts. Write in plain instruction: *"I am…"*, *"The agent does not…"*.
- **Don't name third parties without their consent.** This applies inside your overlay as much as in agent outputs.
- **Don't treat the starter as a substitute for Verse-ality Certified review** if your context genuinely warrants it. The starter is a relational floor. Certified is a reviewed deployment with accountability.

---

*Ethics as geometry. Coherence as currency. Consent as protocol.*
