import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os

def jacobi(x0, A, b, Tol, niter, error_type):
    x0 = np.array(eval(x0), dtype=float)
    A = np.array(eval(A), dtype=float)
    b = np.array(eval(b), dtype=float)
    
    D = np.diag(np.diag(A))
    L = -np.tril(A, -1)
    U = -np.triu(A, 1)
    Tr = np.linalg.inv(D) @ (L + U)
    C = np.linalg.inv(D) @ b
    
    autovalores = np.linalg.eigvals(Tr)
    Re = f"Radio espectral: {max(np.abs(autovalores))}"
    
    xi = []
    E = []
    N = []
    error = Tol + 1
    c = 0

    while error > Tol and c < niter:
        x1 = Tr @ x0 + C
        if error_type == "Error Absoluto":
            e = np.linalg.norm(x1 - x0, np.inf)
        else:
            e = np.linalg.norm((x1 - x0) / x1, np.inf)
        error = e
        E.append(e)
        xi.append(x1.tolist())
        N.append(c + 1)
        x0 = x1
        c += 1

    r = f"{x1} Es una aproximación de la solución del sistema con una tolerancia = {Tol}" if error < Tol else f"Fracasó en {niter} iteraciones"

    df = pd.DataFrame(xi, columns=[f"x{i+1}" for i in range(x1.size)])
    df.insert(0, "Iteration", N)
    df["E"] = E

    os.makedirs("app/tables", exist_ok=True)
    df.to_csv("app/tables/tabla_jacobi.csv", index=False)

    plot_system(A, x1, b, "app/static/grafica_jacobi.png")
    return r, N, xi, E, Re

def format_number(num):
    return f"{num:.4e}" if abs(num) >= 1e6 else f"{num:.8f}"

def plot_system(A, x, b, filename):
    sizee, const = calculate_plot_size(len(b))
    fig, ax = plt.subplots(figsize=(sizee, sizee / 2))
    ax.axis('off')
    ax.text(0.01, 1.0, "A", fontsize=8, fontweight='bold')
    for i, row in enumerate(A):
        ax.text(0.01, 0.88 - i*0.12, '    '.join([f"{val:.2f}" for val in row]), fontsize=8, color='blue')
    
    xpos = 0.01 + const * len(b)
    ax.text(xpos, 0.8, "*", fontsize=15, fontweight='bold')
    xpos += 0.06
    ax.text(xpos, 1.0, "xn", fontsize=8, fontweight='bold')
    for i, val in enumerate(x):
        ax.text(xpos, 0.88 - i*0.12, format_number(val), fontsize=8, color='green')
    
    xpos += 2.2 * const
    ax.text(xpos, 0.8, "=", fontsize=15, fontweight='bold')
    xpos += const / 2
    ax.text(xpos, 1.0, "b", fontsize=8, fontweight='bold')
    for i, val in enumerate(b):
        ax.text(xpos, 0.88 - i*0.12, f"{val:.2f}", fontsize=8, color='red')

    os.makedirs(os.path.dirname(filename), exist_ok=True)
    plt.savefig(filename)
    plt.close()

def calculate_plot_size(b_len):
    if b_len in {1, 2, 3}:
        return 3, 0.15
    elif b_len == 4:
        return 3.4, 0.135
    elif b_len == 5:
        return 4.2, 0.11
    else:
        return 4.6, 0.105
