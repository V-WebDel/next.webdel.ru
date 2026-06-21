"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "userConsent";
const CONSENT_EXPIRATION_KEY = "consentExpiration";
const CONSENT_DAYS = 30;

function getExpirationDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date.toISOString();
}

function isConsentExpired() {
  const expirationDate = localStorage.getItem(CONSENT_EXPIRATION_KEY);

  if (!expirationDate) return true;

  const expirationTime = new Date(expirationDate).getTime();

  return Number.isNaN(expirationTime) || Date.now() > expirationTime;
}

function shouldShowConsent() {
  try {
    return !localStorage.getItem(CONSENT_KEY) || isConsentExpired();
  } catch {
    return true;
  }
}

export default function ConsentCookies() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setIsVisible(shouldShowConsent());
    });
  }, []);

  function acceptConsent() {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
      localStorage.setItem(
        CONSENT_EXPIRATION_KEY,
        getExpirationDate(CONSENT_DAYS)
      );
    } catch {
      // The banner can still be dismissed for the current session.
    }

    setIsVisible(false);
  }

  return (
    <div className={`consent-cookies${isVisible ? "" : " hidden"}`}>
      <div className="container">
        <div className="consent-cookies__wrap">
          <div className="consent-cookies__content">
            <div className="consent-cookies__text">
              На сайте используются cookie-файлы для персонализации контента и
              анализа трафика.
              <br />
              Продолжая работу с сайтом, вы соглашаетесь с{" "}
              <Link href="/politica">Политикой в конфиденциальности</Link>.
            </div>
          </div>
          <div className="consent-cookies__btns">
            <button
              className="consent-cookies__btn btn-accept"
              type="button"
              onClick={acceptConsent}
            >
              Принять
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
