import { PageLayout } from "@/components/layout/PageLayout";

const AboutPage = () => {
  return (
    <PageLayout
      title="このサイトについて"
      description="このアプリは気候変動に関するデータを可視化し、気候変動を直感的に理解する一助となることを目的としています。"
    >
      <section className="mb-6">
        <p className="text-gray-800 leading-relaxed">
          気候変動に関するデータは{" "}
          <a
            href="https://ourworldindata.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Our World in Data
          </a>{" "}
          から取得しています。
        </p>
      </section>
    </PageLayout>
  );
};

export default AboutPage;
