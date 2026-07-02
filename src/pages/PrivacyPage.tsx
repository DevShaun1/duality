import { Link } from 'react-router-dom';

import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { devComponentAttrs } from '@/lib/devtools';

export default function PrivacyPage() {
  return (
    <PageContainer {...devComponentAttrs('PrivacyPage')}>
      <PageHeader
        title="Privacy Notice"
        description="How Duality stores, protects, and processes your reflections."
      />

      <div className="space-y-8 rounded-2xl border border-border/60 bg-card/60 p-6 text-sm leading-7 text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Our promise</h2>
          <p>
            Reflection requires trust. Duality is built to help you explore your thoughts, not to
            judge, profile, advertise to, or sell information about you. Your reflections belong to
            you. We only use them to provide the reflection features you request, and we aim to be
            clear about how your information is handled.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">What we collect</h2>
          <p>
            Duality stores the information you choose to provide, including your reflection text,
            sleep hours, energy rating, mood rating, stress rating, exercise status, generated
            insights, and basic account details such as your email address and display name.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">How your reflections are used</h2>
          <p>
            Your reflections are stored in your private account and processed so Duality can
            generate summaries, themes, possible assumptions, alternative perspectives, and
            reflection questions.
          </p>
          <p>
            To generate AI-powered insights, your reflection content is securely sent to OpenAI for
            processing. The generated insight is returned to Duality and stored alongside your
            reflection so you can revisit it later.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">What we do not do</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>We do not sell your personal data.</li>
            <li>We do not use your reflections for advertising.</li>
            <li>We do not share your reflections with other users.</li>
            <li>
              Duality is not intended to provide therapy, medical advice, diagnosis, or treatment.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Protecting your information</h2>
          <p>
            Your reflections are stored securely and are only accessible through your account. We
            take reasonable measures to protect your personal information and limit access to the
            systems required to provide the Duality service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Your rights and choices</h2>
          <p>
            You can access, update, or delete your reflections at any time. You can also permanently
            delete your account from your profile, which will remove your account and associated
            data. If you need additional assistance with your data, you can contact the Duality
            team.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">POPIA and GDPR transparency</h2>
          <p>
            Duality aims to follow privacy principles from POPIA and GDPR by collecting only what is
            needed, explaining why data is collected, protecting personal information, limiting use
            to the reflection service, and giving users a way to request access, correction, or
            deletion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">A note for testers</h2>
          <p>
            Duality is currently an MVP. While we take privacy seriously, the product is still
            evolving. Please avoid sharing highly sensitive personal or confidential information
            during the testing period. Your feedback helps improve both the product and its privacy
            experience.
          </p>
        </section>

        <Link to="/reflect" className="text-primary hover:text-primary/90">
          Return to reflection
        </Link>
      </div>
    </PageContainer>
  );
}
