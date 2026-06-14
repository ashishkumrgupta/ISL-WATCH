import { hasSignForToken, librarySize } from "../signing/signDictionary";

interface SignLibraryPanelProps {
  activeGlossToken: string | null;
  isPlaying: boolean;
}

export function SignLibraryPanel({ activeGlossToken, isPlaying }: SignLibraryPanelProps) {
  const hasLibrary = librarySize() > 0;
  const activeHasSign =
    activeGlossToken !== null && hasSignForToken(activeGlossToken);

  return (
    <div className="sign-library-panel">
      <div className="sign-library-panel__icon" aria-hidden="true">
        🤟
      </div>
      <h3 className="sign-library-panel__title">Signer video</h3>
      {!hasLibrary ? (
        <>
          <p className="sign-library-panel__message">
            <strong>Not available yet.</strong> Real ASL sign clips are being added in Phase 1.
            We no longer show placeholder robot gestures — that was misleading.
          </p>
          {isPlaying && activeGlossToken && (
            <p className="sign-library-panel__active">
              Active gloss: <code>{activeGlossToken}</code>
              <span className="sign-library-panel__status sign-library-panel__status--missing">
                — sign not in library
              </span>
            </p>
          )}
        </>
      ) : activeHasSign ? (
        <p className="sign-library-panel__message">
          Playing sign for <code>{activeGlossToken}</code> (Phase 1+)
        </p>
      ) : (
        <p className="sign-library-panel__message">
          {activeGlossToken ? (
            <>
              <code>{activeGlossToken}</code>
              <span className="sign-library-panel__status sign-library-panel__status--missing">
                — sign not in library
              </span>
            </>
          ) : (
            "Press play — active gloss token will appear here"
          )}
        </p>
      )}
    </div>
  );
}
