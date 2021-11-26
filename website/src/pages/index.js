import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'For Cloudflare Workers',
    // imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        You can think of Sunder as <a href="https://koajs.com/">Koa</a> or <a href="https://expressjs.com/">Express</a> for serverless. Its main target is <a href="https://workers.cloudflare.com">Cloudflare Workers</a>.
      </>
    ),
  },
  {
    title: 'Small and sharp',
    // imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        Sunder is only a few hundred lines of code at its core, it leaves you the freedom to use whatever parts you like.
      </>
    ),
  },
  {
    title: 'Modern',
    // imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        Encourages modern asynchronous Javascript or strongly typed Typescript. Lightning fast to build with ESBuild.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Home`}
      description="A framework for Cloudflare Workers">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
