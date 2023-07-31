import styled from "@emotion/styled";

export const EmptyArticleWrapper = styled("div")`
  width: 100vw !important;
  display: flex;
  flex-direction: column;
  color: var(--fg-color);
  align-items: center;

  svg {
    font-size: var(--font-h1);
    color: var(--primary-color);
  }
`;

export const StyledTtile = styled("div")`
  font-weight: bold;
  font-size: var(--font-h3);
`;
export const StyledDescript = styled("div")`
  font-size: var(--font);
`;
