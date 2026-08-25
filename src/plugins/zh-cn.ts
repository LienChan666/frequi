import { translateZhCN } from '@/locales/zh-CN';

const translatedAttributes = ['title', 'placeholder', 'aria-label'] as const;
const skippedParents = new Set(['CODE', 'PRE', 'SCRIPT', 'STYLE', 'TEXTAREA']);

function translatePreservingWhitespace(value: string): string {
  const match = value.match(/^(\s*)(.*?)(\s*)$/s);
  if (!match) return value;
  const [, leading, text, trailing] = match;
  if (!text) return value;
  return `${leading}${translateZhCN(text)}${trailing}`;
}

function shouldSkip(node: Node): boolean {
  const parent = node instanceof Element ? node : node.parentElement;
  if (!parent) return false;
  return Boolean(parent.closest('[data-no-translate], code, pre, script, style, textarea'));
}

function translateTextNode(node: Text): void {
  if (!node.nodeValue || shouldSkip(node)) return;
  const translated = translatePreservingWhitespace(node.nodeValue);
  if (translated !== node.nodeValue) node.nodeValue = translated;
}

function translateElement(element: Element): void {
  if (shouldSkip(element) || skippedParents.has(element.tagName)) return;

  for (const attribute of translatedAttributes) {
    const value = element.getAttribute(attribute);
    if (!value) continue;
    const translated = translateZhCN(value);
    if (translated !== value) element.setAttribute(attribute, translated);
  }

  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) translateTextNode(child as Text);
  }
}

function translateTree(root: Node): void {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text);
    return;
  }
  if (!(root instanceof Element)) return;
  translateElement(root);
  root.querySelectorAll('*').forEach(translateElement);
}

export function installZhCN(): MutationObserver {
  document.documentElement.lang = 'zh-CN';
  document.title = 'FreqUI 中文版';
  translateTree(document.body);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        translateTextNode(mutation.target as Text);
      } else if (mutation.type === 'attributes') {
        translateElement(mutation.target as Element);
      } else {
        mutation.addedNodes.forEach(translateTree);
      }
    }
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: [...translatedAttributes],
    characterData: true,
    childList: true,
    subtree: true,
  });
  return observer;
}
