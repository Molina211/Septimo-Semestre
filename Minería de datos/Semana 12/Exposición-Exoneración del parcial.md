# Exposición/Exoneración del parcial

---

Notebook de regresión lineal aplicado a un dataset de razas de perros para explicar/predicción de `vida_promedio` principalmente desde `log(peso_promedio)` y variables auxiliares.

## Qué hace

- Explora la relación entre `vida_promedio` y el peso (incluye correlación `r` y gráficas).
- Ajusta una **regresión lineal simple**: `vida_promedio ~ log_peso`.
- Propone una **regresión múltiple** con `log_peso`, `diferencia_sexual_peso` y `hipoalergenico`, revisando:
  - multicolinealidad (VIF),
  - significancia (eliminación *backward*),
  - supuestos (Breusch-Pagan, Shapiro-Wilk, Durbin-Watson),
  - observaciones influyentes (Cook’s Distance).
- Compara y valida modelos con:
  - métricas globales (R², RMSE, MAE, AIC, BIC),
  - splits train/test 60/40, 70/30, 80/20,
  - cross-validation 5-fold.
- Entrega ecuaciones finales con coeficientes e intervalos de confianza al 95%.

## Resultado clave

El peso en escala log (`log_peso`) queda como el predictor principal; las variables adicionales no aportan mejora significativa en el modelo final según la validación del notebook.
